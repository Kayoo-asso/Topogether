import React, { useEffect, useMemo, useState } from "react";
import { selectQuark, SelectQuark, selectSignal, SelectSignal, SelectSignalNullable, trackContext } from ".";
import { Quark, derive, effect, quark, QuarkOptions, untrack, Signal, SelectQuarkNullable } from "./quarky";


// TODO: implement options
export interface WatchDependenciesOptions {
    memo?: boolean
}

const defaultOptions: WatchDependenciesOptions = {
    memo: true
}

// TODO: The first call to watchDependencies in a component tree creates a root
// Each root batches all Quarky operations underneath it
// The first root schedules execution of all batches in a useEffect

// the result of watchDependencies is invokable iff the option `memo` is set to false
// (the result of React.memo is not invokable)
export function watchDependencies<T>(component: React.FunctionComponent<T>, options?: WatchDependenciesOptions) {
    const wrapped = (props: T, context?: any) => {
        const [result, scope] = trackContext(() => component(props, context));
        const [, forceRender] = useState([]);
        // reruns every time
        useEffect(() => {
            const e = effect(() => {
                forceRender([]);
            }, { watch: scope.accessed, lazy: true });

            return e.dispose;
        });
        return result;
    }
    const actualOpt = {
        ...defaultOptions,
        ...options
    };
    
    return actualOpt.memo
        ? React.memo(wrapped)
        : wrapped;

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

export function useCreateQuark<T>(value: T, options?: QuarkOptions<T>): Quark<T>;
export function useCreateQuark<T>(computation: () => T, deps?: React.DependencyList, options?: QuarkOptions<T>): Signal<T>

export function useCreateQuark<T>(
    arg1: T | (() => T),
    arg2?: QuarkOptions<T> | React.DependencyList,
    options?: QuarkOptions<T>
): Signal<T> | Quark<T> | SelectQuark<T> | SelectSignal<T> {
    // don't default to an empty dependency list here, it's better to rerun the computation and ensure a correct result
    if (typeof arg1 === "function") {
        return useMemo(() => derive(arg1 as () => T, options), arg2 as React.DependencyList);
    }
    return useMemo(() => quark(arg1 as T, arg2 as QuarkOptions<T> | undefined), [])
}

export function useSelectSignal<T>(): SelectSignalNullable<T>;
export function useSelectSignal<T>(initial: Signal<T>): SelectSignal<T>;
export function useSelectSignal<T>(initial?: Signal<T>): SelectSignal<T> | SelectSignalNullable<T> {
    return useMemo(() => selectSignal<T>(initial as any), []);
}

export function useSelectQuark<T>(): SelectQuarkNullable<T>;
export function useSelectQuark<T>(initial: Quark<T>): SelectQuark<T>;
export function useSelectQuark<T>(initial?: Quark<T>): SelectQuark<T> | SelectQuarkNullable<T> {
    return useMemo(() => selectQuark<T>(initial as any), []);
}

const quarkKeys: WeakMap<Signal<any>, number> = new WeakMap();
let keyCount = 0;

export function reactKey<T>(quark: Signal<T>): string | number;
export function reactKey<T, K extends keyof T>(quark: Signal<T>, keyProperty: K): string | number;

export function reactKey<T>(quark: Signal<T>, keyProperty?: string): string | number {
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