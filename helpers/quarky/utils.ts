import { quark } from ".";
import { QuarkArrayOld } from "./QuarkArray";
import { WritableQuark } from "./quarky";

// TypeScript dark arts
export type Quarkify<T, Entities> = {
    [K in keyof T]:
    T[K] extends Entities[]
    ? QuarkArrayOld<Quarkify<T[K][number], Entities>>
    : T[K] extends Entities
    ? Quarkify<T[K], Entities>
    : T[K]
};

export function quarkArray<T>(items: T[]): QuarkArrayOld<T>;
export function quarkArray<T, U>(items: T[], transform: (t: T) => WritableQuark<U>): QuarkArrayOld<U>;
export function quarkArray<T, U>(items: T[], transform?: (t: T) => WritableQuark<U>): QuarkArrayOld<T | U> {
    const result: Array<WritableQuark<T | U>> = new Array(items.length);
    const quarkify = transform
        ? transform
        : (x: T) => quark(x);
    for (var i = 0; i < items.length; i++) {
        result[i] = quarkify(items[i]);
    }
    return new QuarkArrayOld(result);
}