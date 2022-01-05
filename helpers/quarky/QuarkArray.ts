import { QuarkIter } from "./QuarkIter";
import { quark, WritableQuark } from "./quarky";


// export interface QuarkArray<T> extends Iterable<T> {
//     length: number,
//     at(i: number): T,
//     set(i: number, value: T): void,
//     quarks(): QuarkArrayRaw<T>,
//     lazy(): QuarkIter<T>,
// }

const alwaysFalse = () => false;

export interface QuarkArrayRaw<T> extends Iterable<WritableQuark<T>> {
    lazy(): QuarkIter<WritableQuark<T>>
}

// NOTE: the return values of all the array methods become invalid if done within a batch (since modifications apply later)
// Should we not return anything instead? Or wrap them in a Ref object, to ensure the values can be used at the end of the batch
export class QuarkArray<T> implements QuarkArray<T> {
    #source: WritableQuark<Array<WritableQuark<T>>>;

    // TODO: auto-setup callbacks (so it works even on push etc)
    constructor(items: T[]) {
        const itemsWrapped = items.map(x => quark(x));
        // the alwaysFalse allows us to modify the array in place and return the same reference to update the quark
        this.#source = quark(itemsWrapped, { equal: alwaysFalse });
    }

    get length(): number {
        return this.#source().length;
    }

    // removing undefined from the return type, since it's annoying
    at(i: number): T {
        return this.#source().at(i)!();
    }

    set(i: number, value: T) {
        this.#source()[i].set(value);
    }

    #apply<U>(operation: (buffer: WritableQuark<T>[]) => U): U {
        let output: U;
        this.#source.set(x => {
            output = operation(x);
            return x;
        });
        return output!;
    }

    // TODO: hook up predefined effects
    push(value: T): number {
        return this.#apply(x => x.push(quark(value)));
    }

    pop(): WritableQuark<T> | undefined {
        return this.#apply(x => x.pop());
    }

    shift(): WritableQuark<T> | undefined {
        return this.#apply(x => x.shift());
    }

    unshift(...items: T[]): number {
        return this.#apply(x => x.unshift(...items.map(x => quark(x))));
    }

    splice(start: number, deleteCount?: number, ...items: T[]): WritableQuark<T>[] {
        return this.#apply(x =>
            deleteCount
                ? x.splice(start, deleteCount as number, ...items.map(x => quark(x)))
                // does not work if a 2nd argument is provided, even if it's undefined
                : x.splice(start)
        );
    }

    toArray(): T[] {
        return Array.from(this);
    }

    [Symbol.iterator]() {
        const iter = new QuarkArrayIterator(this.#source);
        iter.init();
        return iter;
    }

    quarks(): QuarkArrayRaw<T> {
        return new QuarkArrayRawImpl(this.#source());
    }

    lazy(): QuarkIter<T> {
        const iter = new QuarkArrayIterator(this.#source);
        return new QuarkIter(iter, iter.init);
    }
}

class QuarkArrayRawImpl<T> implements QuarkArrayRaw<T> {
    constructor(private quarks: WritableQuark<T>[]) {}

    lazy(): QuarkIter<WritableQuark<T>> {
        return new QuarkIter(this.quarks[Symbol.iterator](), () => { });
    }

    [Symbol.iterator](): Iterator<WritableQuark<T>> {
        return this.quarks[Symbol.iterator]();
    }
}



// TODO: reset() method?
class QuarkArrayIterator<T> implements Iterator<T> {
    private source: WritableQuark<Array<WritableQuark<T>>>;
    private buffer: Array<WritableQuark<T>>;
    private pos: number = 0;

    constructor(source: WritableQuark<Array<WritableQuark<T>>>) {
        this.source = source;
        this.buffer = [];
    }

    init() {
        this.pos = 0;
        this.buffer = this.source();
    }
    
    next(): IteratorResult<T> {
        if (this.pos < this.buffer.length) {
            return { done: false, value: this.buffer[this.pos++]() };
        } else {
            return { done: true, value: undefined };
        }
    }
}
