import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState, useReducer, ReactElement } from "react";
import { Track } from "types";
import { quarkArray } from ".";
import { cleanupEffect, CleanupHelper, DataQuark, Derivation, derive, effect, quark, Quark, read, StateUpdate, write } from "./quarky";

let subsBatch: DataQuark<any>[] | null = null;

export function startQuarkyBatch() {
    subsBatch = [];
}

export function useQuarkyBatch() {
    if (!subsBatch) {
        throw new Error(`${useQuarkyBatch.name}() should always be preceded by a ${startQuarkyBatch.name}() call`);
    }
    const [, setState] = useState(false);
    // Copy the reference to local, since we will be setting the global variable to null
    const subs = subsBatch;
    useEffect(() => {
        const forceRender = () => setState(x => !x);
        const subscription = effect(forceRender, { lazy: true, watch: subs});
        return () => cleanupEffect(subscription);
    }, subs);
    subsBatch = null;
}

// automatically apply quarkyBatch to a component
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
    // This conditional is fine: the same branch will be taken in every component execution,
    // and the sequence of React hooks will remain stable
    if (subsBatch) subsBatch.push(quark);
    else useSubscription([quark]);

    const current = read(quark);
    // always return the same setter (likely less performant than useCallback, but plays nicely with useQuarkArray)
    const setter = getSetter(quark);
    return [current, setter];
}

export function useQuarkRead<T>(quark: DataQuark<T>): T {
    if (subsBatch) subsBatch.push(quark);
    else useSubscription([quark]);

    return read(quark);
}

// use a WeakMap to not keep quarks alive (also more performant)
// required to provide referentially identical setters to useQuarkArray, without relying
// on useCallback (since we're iterating over the array)
const quarkSetters: WeakMap<Quark<any>, Dispatch<SetStateAction<any>>> = new WeakMap();

export function useQuarkArray<T>(quarkArray: Quark<Quark<T>[]>): [T, Dispatch<SetStateAction<T>>][] {
    const quarks = read(quarkArray);

    const output: [T, Dispatch<SetStateAction<T>>][] = new Array(quarks.length);
    for (let i = 0; i < quarks.length; i++) {
        const q = quarks[i];
        output[i] = [read(q), getSetter(q)];
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

// required to use a map to ensure identical setters are provided for useQuarkArray, as we are unable to rely on useCallback
function getSetter<T>(quark: Quark<T>): Dispatch<SetStateAction<T>> {
    const maybeSetter = quarkSetters.get(quark);
    if (maybeSetter) {
        return maybeSetter;
    } else {
        const setter = (t: SetStateAction<T>) => write(quark, t);
        quarkSetters.set(quark, setter);
        return setter;
    }
}