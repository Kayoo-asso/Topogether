import { isIterable, ConcatIterator, FilterIterator, Flattened, FlattenIterator, MapIterator, ZipIterator, ResettableIterator, ResettableIteratorWrapper} from "./iterators";
import { derive, Signal } from "./quarky";

// should initially be created from a Quark<Array<Quark<T>>>
// init should be the init function of QuarkArrayIterator
export class QuarkIter<T> implements Iterable<T> {
    private readonly iterator: ResettableIterator<T>;
    private result: Signal<T[]> | null;

    constructor(source: ResettableIterator<T> | Iterable<T>) {
        this.iterator = isIterable(source)
            ? new ResettableIteratorWrapper(source)
            : source;
        this.result = null;
    }

    filter(predicate: (item: T) => boolean): QuarkIter<T>;
    filter<U extends T>(predicate: (item: T) => item is U): QuarkIter<U>;
    filter<U extends T>(
        predicate: ((item: T) => boolean) | ((item: T) => item is U)
    ): QuarkIter<T> | QuarkIter<U> {
        return new QuarkIter(
            new FilterIterator(this.iterator, predicate),
        );
    }

    concat(other: QuarkIter<T>): QuarkIter<T> {
        return new QuarkIter(
            new ConcatIterator(this.iterator, other.iterator),
        );
    }

    map<U>(fn: (item: T, index: number) => U): QuarkIter<U> {
        return new QuarkIter(
            new MapIterator(this.iterator, fn),
        );
    }

    unwrap<U>(this: QuarkIter<Signal<U>>): QuarkIter<U> {
        return this.map(x => x());
    }

    flatten(): QuarkIter<Flattened<T>> {
        return new QuarkIter(
            new FlattenIterator(this.iterator),
        );
    }

    zip(other: QuarkIter<T>): QuarkIter<[T, T]> {
        return new QuarkIter(
            new ZipIterator(this.iterator, other.iterator),
        )
    }

    toArray(): T[] {
        return Array.from(this);
    }

    toMemo(): readonly T[] {
        if (!this.result) {
            this.result = derive((() => Array.from(this)));
        }
        return this.result();
    }

    find(predicate: (item: T) => boolean): Signal<T | undefined> {
        return () => {
            this.iterator.reset();
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
        };
    }

    reduce<A>(fn: (acc: A, item: T) => A, initial: () => A): Signal<A> {
        return () => {
            this.iterator.reset();
            let result: IteratorResult<T>;
            let acc = initial();
            while (true) {
                result = this.iterator.next();
                if (result.done) return acc;
                acc = fn(acc, result.value);
            };
        };
    }

    // Avoid exhausting the inner iterator
    [Symbol.iterator](): Iterator<T> {
        this.iterator.reset();
        return this.iterator;
    }
}