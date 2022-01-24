export interface CloneInitIterator<T> extends Iterator<T> {
    clone(): CloneInitIterator<T>,
    init(): void,
}

export class CloneResetIterableIterator<T> implements CloneInitIterator<T> {
    private source: Iterable<T>
    private iterator: Iterator<T>

    constructor(source: Iterable<T>) {
        this.source = source;
        this.iterator = this.source[Symbol.iterator]();
    }

    init() {
        this.iterator = this.source[Symbol.iterator]();
    }

    clone() {
        return new CloneResetIterableIterator(this.source);
    }

    next(): IteratorResult<T> {
        return this.iterator.next();
    }
}

export class FilterIterator<T, U extends T = T> implements CloneInitIterator<T> {
    constructor(
        private source: CloneInitIterator<T>,
        private predicate: ((item: T) => item is U) | ((item: T) => boolean)
    ) { }

    next(): IteratorResult<U> {
        let result: IteratorResult<T>;
        do {
            result = this.source.next();
        } while (!result.done && !this.predicate(result.value))
        return result as IteratorResult<U>;
    }

    init() {
        this.source.init();
    }

    clone() {
        return new FilterIterator(this.source, this.predicate);
    }
}

export class MapIterator<T, U> implements CloneInitIterator<U> {
    private count: number = 0;

    constructor(
        private source: CloneInitIterator<T>,
        private fn: (item: T, index: number) => U,
    ) { }

    next(): IteratorResult<U> {
        const res = this.source.next();
        if (res.done) return res;

        const value = this.fn(res.value, this.count++);
        return { value, done: false };
    }

    init() {
        this.source.init();
    }

    clone() {
        return new MapIterator(this.source, this.fn);
    }
}

export type Flattened<T> =
    T extends Iterable<infer U>
    ? U
    : T;

export class FlattenIterator<T> implements CloneInitIterator<Flattened<T>> {
    private inner: Iterator<any> | undefined = undefined;
    constructor(
        private outer: CloneInitIterator<T>,
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
        if (isIterable(value)) {
            this.inner = value[Symbol.iterator]();
            return this.next();
        }
        return { value, done };
    }

    init() {
        this.outer.init();
        this.inner = undefined;
    }

    clone() {
        return new FlattenIterator(this.outer);
    }
}

export class ConcatIterator<T> implements CloneInitIterator<T> {
    constructor(
        private first: CloneInitIterator<T>,
        private second: CloneInitIterator<T>,
    ) { }

    next(): IteratorResult<T> {
        const res = this.first.next();
        if (!res.done) return res;
        return this.second.next();
    }

    init() {
        this.first.init();
        this.second.init();
    }

    clone() {
        return new ConcatIterator(this.first, this.second);
    }
}

export class ZipIterator<T> implements CloneInitIterator<[T, T]> {
    constructor(
        private first: CloneInitIterator<T>,
        private second: CloneInitIterator<T>,
    ) { }

    next(): IteratorResult<[T, T]> {
        const left = this.first.next();
        const right = this.second.next();
        return {
            value: [left.value, right.value],
            done: left.done || right.done
        }
    }

    init() {
        this.first.init();
        this.second.init();
    }

    clone() {
        return new ZipIterator(this.first, this.second);
    }
}

// export function isIterator(x: unknown): x is Iterable<unknown> {
//     return typeof x === "object" && x !== null && typeof (x as any).next === "function";
// }

export function isIterable(candidate: any): candidate is Iterable<any> {
    return typeof candidate === 'object' && candidate !== null && typeof candidate[Symbol.iterator] === 'function'
}