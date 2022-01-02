import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState, useReducer, ReactElement } from "react";
import { cleanupEffect, CleanupHelper, DataQuark, Derivation, derive, effect, quark, Quark, read, StateUpdate, write } from "./quarky";

let subsBatch: DataQuark<any>[] | null = null;

export function startQuarkyBatch() {
    if (subsBatch) throw new Error("A previous call to `startQuarkyBatch()` was not closed by `useQuarkyBatch()`");
    subsBatch = [];
}

export function useQuarkyBatch() {
    if (!subsBatch) throw new Error("`useQuarkyBatch()` should always be preceded by `startQuarkyBatch()`");
    useSubscription(subsBatch);
    subsBatch = null;
}

// automatically apply quarkyBatch to a component
// requires the JSX to be wrapped in a closure: `return () => <div>...</div>`
// not a fan of this API
export function withQuarky<Props>(
    component: (props: React.PropsWithChildren<Props>, context?: any) => (() => ReactElement<any, any> | null)
): React.FunctionComponent<Props> {
    return (props: React.PropsWithChildren<Props>, context?: any) => {
        startQuarkyBatch();
        const contentClosure = component(props, context);
        useQuarkyBatch();
        return contentClosure();
    }
}

export function useQuark<T>(quark: Quark<T>): [T, Dispatch<SetStateAction<T>>] {
    const current = useQuarkValue(quark);
    // always return the same setter (likely less performant than useCallback, but plays nicely with useQuarkArray)
    const setter = useQuarkSetter(quark);
    return [current, setter];
}

export function useQuarkValue<T>(quark: DataQuark<T>): T {
    // This conditional is fine: the same branch will be taken in every component execution,
    // and the sequence of React hooks will remain stable
    if (subsBatch) subsBatch.push(quark);
    else useSubscription([quark]);

    return read(quark);
}

// use a WeakMap to not keep quarks alive (also more performant)
// required to provide referentially identical setters through useQuarkSetter for useQuarkArray,
// without relying on useCallback (since we're iterating over the array)
const quarkSetters: WeakMap<Quark<any>, Dispatch<SetStateAction<any>>> = new WeakMap();

export function useQuarkSetter<T>(quark: Quark<T>): Dispatch<SetStateAction<T>> {
    const maybeSetter = quarkSetters.get(quark);
    if (maybeSetter) {
        return maybeSetter;
    } else {
        const setter = (t: SetStateAction<T>) => write(quark, t);
        quarkSetters.set(quark, setter);
        return setter;
    }
}

export function useQuarkArray<T>(quarkArray: Quark<Quark<T>[]>): [T, Dispatch<SetStateAction<T>>][] {
    const quarks = read(quarkArray);

    const output: [T, Dispatch<SetStateAction<T>>][] = new Array(quarks.length);
    for (let i = 0; i < quarks.length; i++) {
        const q = quarks[i];
        output[i] = [read(q), useQuarkSetter(q)];
    }

    if (subsBatch) subsBatch.push(quarkArray, ...quarks);
    else useSubscription([quarkArray, ...quarks]);

    return output;
}

function useSubscription(quarks: DataQuark<any>[]) {
    const [, setState] = useState([]);
    useEffect(() => {
        const forceRender = () => setState([]);
        const sub = effect(forceRender, { lazy: true, watch: quarks });
        return () => cleanupEffect(sub);
    }, quarks);
}

export const useCreateQuark = <T>(value: T, deps?: React.DependencyList): Quark<T> =>
    useMemo(() => quark(value), deps ?? []);