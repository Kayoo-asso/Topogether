import { QuarkIter } from "./QuarkIter";
import { quark, WritableQuark } from "./quarky";


export interface QuarkArray<T> extends Iterable<T> {
    length: number,
    at(i: number): T,
    set(i: number, value: T): void,
    quarks(): QuarkArrayRaw<T>,
    lazy(): QuarkIter<T>,
}

export class QuarkArrayImpl<T> implements QuarkArray<T> {
    #source: WritableQuark<Array<WritableQuark<T>>>;

    // TODO: auto-setup callbacks (so it works even on push etc)
    constructor(items: T[]) {
        const itemsWrapped = items.map(x => quark(x));
        this.#source = quark(itemsWrapped);
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

    push(value: T) {
        this.#source.set([...this.#source(), quark(value)]);
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


interface QuarkArrayRaw<T> extends Iterable<WritableQuark<T>> {
    lazy(): QuarkIter<WritableQuark<T>>
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
