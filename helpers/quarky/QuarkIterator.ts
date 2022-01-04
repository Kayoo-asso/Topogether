import { DataQuark, QuarkArray } from ".";
import { Quark, read, peek, quark, Derivation, derive, write } from "./quarky";

type Flattened<T> =
    T extends QuarkIter<infer U>
    ? U
    : T extends Iterable<infer V>
    ? V
    : T;


// should initially be created from a Quark<Array<Quark<T>>>
// init should be the init function of QuarkArrayIterator
export class QuarkIter<T> {
    private readonly iterator: Iterator<T>;
    private readonly init: () => void;
    private result: Derivation<T[]> | null;

    constructor(iterator: Iterator<T>, init: () => void) {
        this.iterator = iterator;
        this.init = init;
        this.result = null;
    }

    filter(predicate: (item: T) => boolean): QuarkIter<T>;
    filter<U extends T>(predicate: (item: T) => item is U): QuarkIter<U>;
    filter<U extends T>(
        predicate: ((item: T) => boolean) | ((item: T) => item is U)
    ): QuarkIter<T> | QuarkIter<U> {
        return new QuarkIter(
            new FilterIterator(this.iterator, predicate),
            this.init
        );
    }

    concat(other: QuarkIter<T>): QuarkIter<T> {
        return new QuarkIter(
            new ConcatIterator(this.iterator, other.iterator),
            () => { this.init(); other.init(); }
        );
    }

    map<U>(fn: (item: T, index: number) => U): QuarkIter<U> {
        return new QuarkIter(
            new MapIterator(this.iterator, fn),
            this.init,
        );
    }

    flatten(): QuarkIter<Flattened<T>> {
        return new QuarkIter(
            new FlattenIterator(this.iterator),
            this.init
        );
    }

    unwrap<U>(this: QuarkIter<DataQuark<U>>): QuarkIter<U> {
        return new QuarkIter(
            new MapIterator(this.iterator, read),
            this.init
        );
    }

    zip(other: QuarkIter<T>): QuarkIter<[T, T]> {
        return new QuarkIter(
            new ZipIterator(this.iterator, other.iterator),
            () => { this.init(), other.init(); }
        )
    }

    use(): Derivation<T[]> {
        if (!this.result) {
            this.result = derive(() => {
                this.init();
                new Array(this.iterator)
                return Array.from(new IterableWrapper(this.iterator));
            });
        }
        return this.result;
    }

    find(predicate: (item: T) => boolean): Derivation<T | undefined> {
        return derive(() => {
            this.init();
            let result: IteratorResult<T>;
            while (true) {
                result = this.iterator.next();
                if (result.done) {
                    return undefined;
                }
                if (predicate(result.value)) {
                    return result.value;
                }
            }
        });
    }

    reduce<A>(fn: (acc: A, item: T) => A, initial: A): Derivation<A> {
        return derive(() => {
            this.init();
            let result: IteratorResult<T>;
            let acc = initial;
            while (true) {
                result = this.iterator.next();
                if (result.done) return acc;
                acc = fn(acc, result.value);
            };
        });
    }
}

class IterableWrapper<T> implements Iterable<T> {
    constructor(
        private iterator: Iterator<T>
    ) { }

    [Symbol.iterator](): Iterator<T, any, undefined> {
        return this.iterator;
    }
}


class FilterIterator<T, U extends T = T> implements Iterator<T> {
    constructor(
        private source: Iterator<T>,
        private predicate: ((item: T) => item is U) | ((item: T) => boolean)
    ) { }

    next(): IteratorResult<U> {
        let result: IteratorResult<T>;
        do {
            result = this.source.next();
        } while (!result.done && !this.predicate(result.value))
        return result as IteratorResult<U>;
    }
}

class MapIterator<T, U> implements Iterator<U> {
    private count: number = 0;

    constructor(
        private source: Iterator<T>,
        private fn: (item: T, index: number) => U,
    ) { }

    next(): IteratorResult<U> {
        const res = this.source.next();
        if (res.done) return res;

        const value = this.fn(res.value, this.count++);
        return { value, done: false };
    }
}

class FlattenIterator<T> implements Iterator<Flattened<T>> {
    private inner?: Iterator<any>
    constructor(
        private outer: Iterator<T>,
    ) { }

    next(): IteratorResult<Flattened<T>> {
        if (this.inner) {
            const result = this.inner.next();
            if (!result.done) return result;
            // don't return from here, check the outer iterator
            this.inner = undefined;
        }

        const { value, done } = this.outer.next();
        if (done) {
            return { value, done };
        }

        // no idea how to properly type this in TypeScript
        if (value instanceof QuarkIter) {
            // cheating a bit to access the inner iterator
            this.inner = (value as any).iterator;
            return this.next();
        } else if (isIterable(value)) {
            this.inner = value[Symbol.iterator]();
            return this.next();
        }
        return { value, done };
    }
}

class ConcatIterator<T> implements Iterator<T> {
    constructor(
        private first: Iterator<T>,
        private second: Iterator<T>,
    ) { }

    next(): IteratorResult<T> {
        const res = this.first.next();
        if (!res.done) return res;
        return this.second.next();
    }
}

class ZipIterator<T> implements Iterator<[T, T]> {
    constructor(
        private first: Iterator<T>,
        private second: Iterator<T>,
    ) { }

    next(): IteratorResult<[T, T]> {
        const left = this.first.next();
        const right = this.second.next();
        return {
            value: [left.value, right.value],
            done: left.done || right.done
        }
    }
}

function isIterable(x: unknown): x is Iterable<unknown> {
    return typeof x === "object" && x !== null && typeof (x as any).next === "function";
}


// function isIterator(x: any): x is Iterator<unknown> {
//     return typeof x === "object" && x !== null && typeof (x as any)[Symbol.iterator] === "function";
// }
