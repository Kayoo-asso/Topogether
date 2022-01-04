import { QuarkIter } from "./QuarkIterator";
import { DataQuark, Derivation, quark, Quark, read, write } from "./quarky";

const alwaysFalse = () => false;

export class QuarkArray<T> extends QuarkIter<Quark<T>> {
    private quarks: Quark<Array<Quark<T>>>;

    constructor(quarks: Quark<T>[]) {
        // returning always false allows us to mutate the array in-place 
        // and return the same reference
        const q = quark(quarks, { equal: alwaysFalse });
        const iter = new QuarkArrayIterator(q);
        super(iter, iter.init);
        this.quarks = q;
    }

    push(item: Quark<T> | Quark<T>[]) {
        if (!Array.isArray(item)) {
            item = [item];
        }
        write(this.quarks, arr => {
            arr.push(...(item as Quark<T>[]));
            return arr;
        })
    }

    // Maybe not return the quark? Avoids leaking information
    pop(): Quark<T> | undefined {
        let item: Quark<T> | undefined;
        write(this.quarks, arr => {
            item = arr.pop()
            return arr;
        });
        return item;
    }

    splice(start: number, deleteCount?: number): void
    splice(start: number, deleteCount: number, ...items: Quark<T>[]): void
    splice(start: number, deleteCount?: number, ...items: Quark<T>[]): void {
        write(this.quarks, arr => {
            deleteCount
                ? arr.splice(start, deleteCount, ...items)
                : arr.splice(start, deleteCount);
            return arr;
        })
    }

    shift(): Quark<T> | undefined {
        let item: Quark<T> | undefined;
        write(this.quarks, arr => {
            item = arr.shift()
            return arr;
        });
        return item;
    }

    reverse() {
        write(this.quarks, arr => {
            arr.reverse();
            return arr;
        });
    }

}

class QuarkArrayIterator<T> implements Iterator<Quark<T>> {
    private source: Quark<Array<Quark<T>>>;
    private buffer: Array<Quark<T>>;
    private pos: number = 0;

    constructor(source: Quark<Array<Quark<T>>>) {
        this.source = source;
        this.buffer = [];
    }

    // call this method before performing actual computation, to register the dependency
    init() {
        this.buffer = read(this.source);
    }

    next(): IteratorResult<Quark<T>> {
        if (this.pos < this.buffer.length) {
            return { done: false, value: this.buffer[this.pos++] };
        } else {
            return { done: true, value: undefined };
        }
    }
}

// TODO: Generic iterator + wrapper for any iterable?