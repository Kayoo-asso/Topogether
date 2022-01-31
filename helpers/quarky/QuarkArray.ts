import { batch } from ".";
import { Flattened, CloneInitIterator } from "./iterators";
import { QuarkIter } from "./QuarkIter";
import { derive, quark, Quark, Signal, untrack, ValueOrWrappedFunction } from "./quarky";

const alwaysFalse = () => false;

export interface QuarkArrayCallbacks<T, Q extends Quark<T> = Quark<T>> {
    onAdd?: (item: T) => Q,
    onDelete?: (item: Q) => void,
}

interface Node<T> {
    value: T,
    next: Node<T> | null,
}

function map<T, U>(input: Quark<T>[], fn: (item: T) => U) {
    const result: Array<Signal<Node<U>>> = new Array(input.length);
    let next: Signal<Node<U>> | null = null;
    for (let i = input.length - 1; i >= 0; --i) {
        next = derive(() => ({
            value: fn(input[i]()),
            next: next ? next() : null
        }));
        result[i] = next;
    }
}

type LinkedList<T> = Quark<Node<T> | null>;

interface DerivedListNode<T> {
    value: T,
    next: Signal<T> | null
}

// NOTE: the return values of all the array methods become invalid if done within a batch (since modifications apply later)
// Should we not return anything instead? Or wrap them in a Ref object, to ensure the values can be used at the end of the batch
// TODO: ensure onAdd and onDelete are called properly for every array method
export class QuarkArray<T> {
    #source: Quark<Array<Quark<T>>>;
    #onAdd: (item: T) => Quark<T>;
    #onDelete?: (item: Quark<T>) => void;

    // TODO: auto-setup callbacks (so it works even on push etc)
    constructor(
        items?: T[],
        callbacks?: QuarkArrayCallbacks<T, any>,
    ) {
        items = items ?? [];
        const quarks: Array<Quark<T>> = new Array(items.length);
        const quarkifier = callbacks?.onAdd ?? quark;
        for (let i = 0; i < items.length; ++i) {
            const q = quarkifier(items[i]);
            quarks[i] = q;
        }
        // the alwaysFalse allows us to modify the array in place and return the same reference to update the quark
        this.#source = quark(quarks, { equal: alwaysFalse });
        this.#onAdd = quarkifier;
        this.#onDelete = callbacks?.onDelete;
     }

    get length(): number {
        return this.#source().length;
    }

    // removing undefined from the return type, since it's annoying
    at(i: number): T {
        const arr = this.#source();
        if (i < 0) i += arr.length;
        const val: Quark<T> | undefined = arr[i];
        return val ? val() : undefined!;
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
        const q = this.#onAdd(value);
        return this.#apply(x => x.push(q));
    }

    pop(): Quark<T> | undefined {
        const val = this.#apply(x => x.pop());
        if (this.#onDelete && val) untrack(() => this.#onDelete!(val));
        return val;
    }

    shift(): Quark<T> | undefined {
        const quark = this.#apply(x => x.shift());
        if (quark && this.#onDelete) untrack(() => this.#onDelete!(quark));
        return quark;
    }

    unshift(...items: T[]): number {
        const quarks = new Array(items.length);
        for (let i = 0; i < items.length; ++i) {
            quarks[i] = this.#onAdd(items[i]);
        }
        return this.#apply(x => x.unshift(...quarks));
    }

    splice(start: number, deleteCount?: number, ...items: T[]): Quark<T>[] {
        return this.#apply(x =>
            deleteCount
                ? x.splice(start, deleteCount as number, ...items.map(x => quark(x)))
                // does not work if a 2nd argument is provided, even if it's undefined
                : x.splice(start)
        );
    }

    remove(item: T) {
        untrack(() => {
            const arr = this.#source();
            for (let i = 0; i < arr.length; i++) {
                const q = arr[i];
                if (q() === item) {
                    arr.splice(i, 1);
                    if(this.#onDelete) this.#onDelete(q);
                    break;
                }
            }
            this.#source.set(arr); 
        });
    }

    removeQuark(quark: Quark<T>) {
        untrack(() => {
            const arr = this.#source().slice(0);
            for (let i = 0; i < arr.length; i++) {
                if (quark === arr[i]) {
                    arr.splice(i, 1);
                    if (this.#onDelete) this.#onDelete(quark);
                    break;
                }
            }
            this.#source.set(arr);
        });
    }

    removeAll(selection: (item: T) => boolean) {
        untrack(() => {
            const current = this.#source();
            const after = [];
            for (let i = 0; i < current.length; ++i) {
                const quark = current[i];
                if (!selection(quark())) {
                    after.push(quark);
                } else if(this.#onDelete) {
                    this.#onDelete(quark);
                }
            }
            this.#source.set(after)
        });
    }

    toArray(): T[] {
        return Array.from(this);
    }

    [Symbol.iterator]() {
        const iter = new QuarkArrayIterator(this.#source);
        iter.init();
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

export class QuarkArrayIteratorRaw<T> implements CloneInitIterator<Quark<T>> {
    private source: Quark<Array<Quark<T>>>;
    private buffer: Array<Quark<T>>;
    private pos: number = 0;

    constructor(source: Quark<Array<Quark<T>>>) {
        this.source = source;
        this.buffer = [];
    }

    init() {
        this.pos = 0;
        this.buffer = this.source();
    }
    
    clone() {
        return new QuarkArrayIteratorRaw(this.source);
    }
    
    next(): IteratorResult<Quark<T>> {
        if (this.pos < this.buffer.length) {
            return { done: false, value: this.buffer[this.pos++] };
        } else {
            return { done: true, value: undefined };
        }
    }

    toArray(): Quark<T>[] {
        return this.source();
    }
}

class QuarkArrayIterator<T> implements CloneInitIterator<T> {
    private source: Quark<Array<Quark<T>>>;
    private buffer: Array<Quark<T>>;
    private pos: number = 0;

    constructor(source: Quark<Array<Quark<T>>>) {
        this.source = source;
        this.buffer = [];
    }

    init() {
        this.pos = 0;
        this.buffer = this.source();
    }

    clone() {
        return new QuarkArrayIterator(this.source);
    }
    
    next(): IteratorResult<T> {
        if (this.pos < this.buffer.length) {
            return { done: false, value: this.buffer[this.pos++]() };
        } else {
            return { done: true, value: undefined };
        }
    }
}
