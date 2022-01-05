import React, { useEffect, useMemo, useState } from "react";
import { trackContext } from ".";
import { WritableQuark, derive, effect, quark, QuarkOptions, untrack, Quark } from "./quarky";


// TODO: implement options
export interface WatchDependenciesOptions {
    memo?: boolean
}

export function watchDependencies<P>(component: React.FC<P>, options?: WatchDependenciesOptions): React.FC<P> {
    return (props, context) => {
        const [result, scope] = trackContext(() => component(props, context));
        const [, forceRender] = useState([]);
        // reruns every time
        useEffect(() => {
            const e = effect(() => {
                forceRender([]);
            }, { watch: scope.accessed });

            return e.dispose;
        });
        return result;
    }
}

// export function useQuark<T>(quark: Quark<T>): [T, Dispatch<SetStateAction<T>>];
// export function useQuark<T>(quark: Derivation<T>): T;
// export function useQuark<T>(quark: QuarkIter<T>): T[];

// export function useQuark<T>(quark: DataQuark<T> | QuarkIter<T>): [T, Dispatch<SetStateAction<T>>] | T | T[] {
//     let sub: DataQuark<T | T[]>;
//     let result: [T, Dispatch<SetStateAction<T>>] | T | T[] ;
//     if (quark instanceof QuarkIter) {
//         sub = quark.use();
//         result = read(sub);
//     } else if (quark.type === NodeType.Quark) {
//         sub = quark;
//         // use getQuarkSetter instead of useCallback since we're in a conditional
//         // and, theoretically, the input could change
//         result = [read(quark), getQuarkSetter(quark)];
//     } else {
//         sub = quark
//         result = read(quark);
//     }
//     if (subsBatch) subsBatch.push(sub);
//     else useSubscription([sub]);
//     return result;
// }

// // export function useQuarkSimple<T>(quark: Quark<T>): [T, Dispatch<SetStateAction<T>>] {
// //     const current = useQuarkValue(quark);
// //     // always return the same setter (likely less performant than useCallback, but plays nicely with useQuarkArray)
// //     const setter = useQuarkSetter(quark);
// //     return [current, setter];
// // }

// // export function useQuarkValue<T>(quark: DataQuark<T>): T {
// //     // This conditional is fine: the same branch will be taken in every component execution,
// //     // and the sequence of React hooks will remain stable
// //     if (subsBatch) subsBatch.push(quark);
// //     else useSubscription([quark]);

// //     return read(quark);
// // }

// // use a WeakMap to not keep quarks alive (also more performant)
// const quarkSetters: WeakMap<Quark<any>, Dispatch<SetStateAction<any>>> = new WeakMap();

// export function getQuarkSetter<T>(quark: Quark<T>): Dispatch<SetStateAction<T>> {
//     const existing = quarkSetters.get(quark);
//     if (existing) {
//         return existing;
//     } else {
//         const setter = (t: SetStateAction<T>) => write(quark, t);
//         quarkSetters.set(quark, setter);
//         return setter;
//     }
// }

// function useSubscription(quarks: DataQuark<any>[]) {
//     const [, setState] = useState([]);
//     useEffect(() => {
//         const forceRender = () => setState([]);
//         const sub = effect(forceRender, { lazy: true, watch: quarks });
//         return () => cleanupEffect(sub);
//     }, quarks);
// }

export function useCreateQuark<T>(): WritableQuark<T | undefined>;
export function useCreateQuark<T>(value: undefined, options?: QuarkOptions<T>): WritableQuark<T | undefined>;
export function useCreateQuark<T>(value: T, options?: QuarkOptions<T>): WritableQuark<T>;
export function useCreateQuark<T>(computation: () => T, deps?: React.DependencyList, options?: QuarkOptions<T>): Quark<T>

export function useCreateQuark<T>(
    arg1?: T | (() => T) | QuarkOptions<T>,
    arg2?: QuarkOptions<T> | React.DependencyList,
    options?: QuarkOptions<T>
): WritableQuark<T> | WritableQuark<T | undefined> | Quark<T> {
    if (!arg1) {
        return useMemo(() => quark<T | undefined>(undefined, arg2 as QuarkOptions<T | undefined> | undefined), []);
    }
    // don't default to an empty dependency list here, it's better to rerun the computation and ensure a correct result
    if (typeof arg1 === "function") {
        return useMemo(() => derive(arg1 as () => T, options), arg2 as React.DependencyList);
    }
    return useMemo(() => quark(arg1 as T, arg2 as QuarkOptions<T> | undefined), [])
}

const quarkKeys: WeakMap<Quark<any>, number> = new WeakMap();
let keyCount = 0;

export function reactKey<T>(quark: Quark<T>): string | number;
export function reactKey<T, K extends keyof T>(quark: Quark<T>, keyProperty: K): string | number;

export function reactKey<T>(quark: Quark<T>, keyProperty?: string): string | number {
    keyProperty = keyProperty ?? "id";
    const obj = untrack(() => quark()) as any;
    const keyType = typeof obj[keyProperty];
    if (keyType === "number" || keyType === "string") {
        return obj[keyProperty];
    }
    const existing = quarkKeys.get(quark);
    if (existing) return existing;
    const id = keyCount++;
    quarkKeys.set(quark, id);
    return id;
}