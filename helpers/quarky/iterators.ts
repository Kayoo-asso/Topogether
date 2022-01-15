export interface ResettableIterator<T> extends Iterator<T> {
    reset(): void,
}

export class ResettableIteratorWrapper<T> implements ResettableIterator<T> {
    private source: Iterable<T>
    private iterator: Iterator<T>

    constructor(source: Iterable<T>) {
        this.source = source;
        this.iterator = this.source[Symbol.iterator]();
    }

    reset() {
        this.iterator = this.source[Symbol.iterator]();
    }

    next(): IteratorResult<T> {
        return this.iterator.next();
    }
}

export class FilterIterator<T, U extends T = T> implements ResettableIterator<T> {
    constructor(
        private source: ResettableIterator<T>,
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
}

export class MapIterator<T, U> implements ResettableIterator<U> {
    private count: number = 0;

    constructor(
        private source: ResettableIterator<T>,
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
}

export type Flattened<T> =
    T extends Iterable<infer U>
    ? U
    : T;

export class FlattenIterator<T> implements ResettableIterator<Flattened<T>> {
    private inner?: Iterator<any>
    constructor(
        private outer: ResettableIterator<T>,
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
}

export class ConcatIterator<T> implements ResettableIterator<T> {
    constructor(
        private first: ResettableIterator<T>,
        private second: ResettableIterator<T>,
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
}

export class ZipIterator<T> implements ResettableIterator<[T, T]> {
    constructor(
        private first: ResettableIterator<T>,
        private second: ResettableIterator<T>,
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
}

// export function isIterator(x: unknown): x is Iterable<unknown> {
//     return typeof x === "object" && x !== null && typeof (x as any).next === "function";
// }

export function isIterable(candidate: any): candidate is Iterable<any> {
    return typeof candidate === 'object' && candidate !== null && typeof candidate[Symbol.iterator] === 'function'
}