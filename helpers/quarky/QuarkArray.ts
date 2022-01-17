import { batch } from ".";
import { Flattened, ResettableIterator } from "./iterators";
import { QuarkIter } from "./QuarkIter";
import { quark, Quark, Signal, untrack, ValueOrWrappedFunction } from "./quarky";

const alwaysFalse = () => false;

// NOTE: the return values of all the array methods become invalid if done within a batch (since modifications apply later)
// Should we not return anything instead? Or wrap them in a Ref object, to ensure the values can be used at the end of the batch
export class QuarkArray<T> {
    #source: Quark<Array<Quark<T>>>;

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
        const arr = this.#source();
        if (i < 0) i += arr.length;
        return arr[i]();
    }

    quarkAt(i: number): Quark<T> {
        const arr = this.#source();
        if (i < 0) i += arr.length;
        return arr[i];
    }

    set(i: number, value: ValueOrWrappedFunction<T>) {
        this.#source()[i].set(value);
    }
    
    // === Iterator functionality ===

    concat(other: QuarkIter<T>): QuarkIter<T> {
        return this.lazy().concat(other);
    }

    filter(predicate: (item: T) => boolean): QuarkIter<T>;
    filter<U extends T>(predicate: (item: T) => item is U): QuarkIter<U>;
    filter<U extends T>(
        predicate: ((item: T) => boolean) | ((item: T) => item is U)
    ): QuarkIter<T> | QuarkIter<U> {
        return this.lazy().filter(predicate);
    }

    flatten(): QuarkIter<Flattened<T>> {
        return this.lazy().flatten();
    }

    zip(other: QuarkIter<T>): QuarkIter<[T, T]> {
        return this.lazy().zip(other);
    }
    
    map<U>(fn: (item: T) => U): QuarkIter<U> {
        return this.lazy().map(fn);
    }

    unwrap<U>(this: QuarkArray<Signal<U>>): QuarkIter<U> {
        return this.map(x => x());
    }

    // === Array methods === 

    find(filter: (item: T) => boolean): T | undefined {
        const q = this.findQuark(filter);
        return q ? q() : undefined;
    }

    findQuark(filter: (item: T) => boolean): Quark<T> | undefined {
        const source = this.#source();
        for (let i = 0; i < source.length; i++) {
            const q = source[i];
            if (filter(q()))
                return q;
        }
    }

    #apply<U>(operation: (buffer: Quark<T>[]) => U): U {
        // batching ensures the returned value is not undefined
        return batch(() => {
            let output: U;
            this.#source.set(x => {
                output = operation(x);
                return x;
            });
            return output!;
        });
    }

    // TODO: hook up predefined effects
    push(value: T): number {
        return this.#apply(x => x.push(quark(value)));
    }

    pop(): Quark<T> | undefined {
        return this.#apply(x => x.pop());
    }

    shift(): Quark<T> | undefined {
        return this.#apply(x => x.shift());
    }

    unshift(...items: T[]): number {
        return this.#apply(x => x.unshift(...items.map(x => quark(x))));
    }

    splice(start: number, deleteCount?: number, ...items: T[]): Quark<T>[] {
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
        iter.reset();
        return iter;
    }

    quarks(): QuarkIter<Quark<T>> {
        const iter = new QuarkArrayIteratorRaw(this.#source);
        return new QuarkIter(iter);
    }

    lazy(): QuarkIter<T> {
        const iter = new QuarkArrayIterator(this.#source);
        return new QuarkIter(iter);
    }
}

export interface QuarkArrayRaw<T> extends Iterable<Quark<T>> {
    lazy(): QuarkIter<Quark<T>>
}

class QuarkArrayIteratorRaw<T> implements ResettableIterator<Quark<T>> {
    private source: Quark<Array<Quark<T>>>;
    private buffer: Array<Quark<T>>;
    private pos: number = 0;

    constructor(source: Quark<Array<Quark<T>>>) {
        this.source = source;
        this.buffer = [];
    }

    reset() {
        this.pos = 0;
        this.buffer = this.source();
    }
    
    next(): IteratorResult<Quark<T>> {
        if (this.pos < this.buffer.length) {
            return { done: false, value: this.buffer[this.pos++] };
        } else {
            return { done: true, value: undefined };
        }
    }
}

// TODO: reset() method?
class QuarkArrayIterator<T> implements ResettableIterator<T> {
    private source: Quark<Array<Quark<T>>>;
    private buffer: Array<Quark<T>>;
    private pos: number = 0;

    constructor(source: Quark<Array<Quark<T>>>) {
        this.source = source;
        this.buffer = [];
    }

    reset() {
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
