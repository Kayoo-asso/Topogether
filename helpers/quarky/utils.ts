import { quark } from ".";
import { QuarkArray } from "./QuarkArray";
import { Quark } from "./quarky";

// TypeScript dark arts
export type Quarkify<T, Entities> = {
    [K in keyof T]:
    T[K] extends Entities[]
    ? QuarkArray<Quarkify<T[K][number], Entities>>
    : T[K] extends Entities
    ? Quarkify<T[K], Entities>
    : T[K]
};

export function quarkArray<T>(items: T[]): QuarkArray<T>;
export function quarkArray<T, U>(items: T[], transform: (t: T) => Quark<U>): QuarkArray<U>;
export function quarkArray<T, U>(items: T[], transform?: (t: T) => Quark<U>): QuarkArray<T | U> {
    const result: Array<Quark<T | U>> = new Array(items.length);
    const quarkify = transform
        ? transform
        : (x: T) => quark(x);
    for (var i = 0; i < items.length; i++) {
        result[i] = quarkify(items[i]);
    }
    return new QuarkArray(result);
}