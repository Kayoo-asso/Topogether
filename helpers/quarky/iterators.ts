export interface CloneResetIterator<T> extends Iterator<T> {
    clone(): CloneResetIterator<T>,
    reset(): void,
}

export class CloneResetIterableIterator<T> implements CloneResetIterator<T> {
    private source: Iterable<T>
    private iterator: Iterator<T>

    constructor(source: Iterable<T>) {
        this.source = source;
        this.iterator = this.source[Symbol.iterator]();
    }

    reset() {
        this.iterator = this.source[Symbol.iterator]();
    }

    clone() {
        return new CloneResetIterableIterator(this.source);
    }

    next(): IteratorResult<T> {
        return this.iterator.next();
    }
}

export class FilterIterator<T, U extends T = T> implements CloneResetIterator<T> {
    constructor(
        private source: CloneResetIterator<T>,
        private predicate: ((item: T) => item is U) | ((item: T) => boolean)
    ) { }

    next(): IteratorResult<U> {
        let result: IteratorResult<T>;
        do {
            result = this.source.next();
        } while (!result.done && !this.predicate(result.value))
        return result as IteratorResult<U>;
    }

    reset() {
        this.source.reset();
    }

    clone() {
        return new FilterIterator(this.source, this.predicate);
    }
}

export class MapIterator<T, U> implements CloneResetIterator<U> {
    private count: number = 0;

    constructor(
        private source: CloneResetIterator<T>,
        private fn: (item: T, index: number) => U,
    ) { }

    next(): IteratorResult<U> {
        const res = this.source.next();
        if (res.done) return res;

        const value = this.fn(res.value, this.count++);
        return { value, done: false };
    }

    reset() {
        this.source.reset();
    }

    clone() {
        return new MapIterator(this.source, this.fn);
    }
}

export type Flattened<T> =
    T extends Iterable<infer U>
    ? U
    : T;

export class FlattenIterator<T> implements CloneResetIterator<Flattened<T>> {
    private inner: Iterator<any> | undefined = undefined;
    constructor(
        private outer: CloneResetIterator<T>,
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

    reset() {
        this.outer.reset();
        this.inner = undefined;
    }

    clone() {
        return new FlattenIterator(this.outer);
    }
}

export class ConcatIterator<T> implements CloneResetIterator<T> {
    constructor(
        private first: CloneResetIterator<T>,
        private second: CloneResetIterator<T>,
    ) { }

    next(): IteratorResult<T> {
        const res = this.first.next();
        if (!res.done) return res;
        return this.second.next();
    }

    reset() {
        this.first.reset();
        this.second.reset();
    }

    clone() {
        return new ConcatIterator(this.first, this.second);
    }
}

export class ZipIterator<T> implements CloneResetIterator<[T, T]> {
    constructor(
        private first: CloneResetIterator<T>,
        private second: CloneResetIterator<T>,
    ) { }

    next(): IteratorResult<[T, T]> {
        const left = this.first.next();
        const right = this.second.next();
        return {
            value: [left.value, right.value],
            done: left.done || right.done
        }
    }

    reset() {
        this.first.reset();
        this.second.reset();
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