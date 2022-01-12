import { isIterable, ConcatIterator, FilterIterator, Flattened, FlattenIterator, MapIterator, ZipIterator} from "./iterators";
import { derive, Signal, Quark } from "./quarky";

const emptyInit = () => { };

// should initially be created from a Quark<Array<Quark<T>>>
// init should be the init function of QuarkArrayIterator
export class QuarkIter<T> implements Iterable<T> {
    private readonly iterator: Iterator<T>;
    private readonly init: () => void;
    private result: Signal<T[]> | null;

    constructor(source: Iterator<T> | Iterable<T>, init?: () => void) {
        this.iterator = isIterable(source)
            ? source[Symbol.iterator]()
            : source;
        this.init = init ?? emptyInit;
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

    unwrap<U>(this: QuarkIter<Signal<U>>): QuarkIter<U> {
        return this.map(x => x());
    }

    flatten(): QuarkIter<Flattened<T>> {
        return new QuarkIter(
            new FlattenIterator(this.iterator),
            this.init
        );
    }

    zip(other: QuarkIter<T>): QuarkIter<[T, T]> {
        return new QuarkIter(
            new ZipIterator(this.iterator, other.iterator),
            () => { this.init(), other.init(); }
        )
    }

    // Does not make a copy by default, so the return array is readonly
    toArray(): readonly T[] {
        if (!this.result) {
            this.result = derive((() => {
                this.init();
                // do not use the QuarkIter itself, since its iterable property
                // depends on the derivation we're creating!
                return Array.from({
                    [Symbol.iterator]: () => this.iterator
                });
            }).bind(this));
        }
        return this.result();
    }

    find(predicate: (item: T) => boolean): Signal<T | undefined> {
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

    reduce<A>(fn: (acc: A, item: T) => A, initial: () => A): Signal<A> {
        return derive(() => {
            this.init();
            let result: IteratorResult<T>;
            let acc = initial();
            while (true) {
                result = this.iterator.next();
                if (result.done) return acc;
                acc = fn(acc, result.value);
            };
        });
    }

    // Avoid exhausting the inner iterator
    [Symbol.iterator](): Iterator<T> {
        return this.toArray()[Symbol.iterator]();
    }
}