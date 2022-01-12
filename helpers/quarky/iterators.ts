export class FilterIterator<T, U extends T = T> implements Iterator<T> {
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

export class MapIterator<T, U> implements Iterator<U> {
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

export type Flattened<T> =
    T extends Iterable<infer U>
    ? U
    : T;

export class FlattenIterator<T> implements Iterator<Flattened<T>> {
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
        if (isIterable(value)) {
            this.inner = value[Symbol.iterator]();
            return this.next();
        }
        return { value, done };
    }
}

export class ConcatIterator<T> implements Iterator<T> {
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

export class ZipIterator<T> implements Iterator<[T, T]> {
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

// export function isIterator(x: unknown): x is Iterable<unknown> {
//     return typeof x === "object" && x !== null && typeof (x as any).next === "function";
// }

export function isIterable(candidate: any): candidate is Iterable<any> {
    return typeof candidate === 'object' && candidate !== null && typeof candidate[Symbol.iterator] === 'function'
}