import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { observerEffect, selectQuark, SelectQuark, selectSignal, SelectSignal, SelectSignalNullable, setBatchUpdates } from ".";
import { Quark, derive, effect, quark, QuarkOptions, untrack, Signal, SelectQuarkNullable } from "./quarky";

setBatchUpdates(ReactDOM.unstable_batchedUpdates);

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
const toggle = (x: boolean) => !x;
export function watchDependencies<T>(component: React.FunctionComponent<T>, options?: WatchDependenciesOptions) {
    const wrapped = (props: T, context?: any) => {
        const [, forceRender] = useState(false);
        const eff = useMemo(() =>
            observerEffect(() => forceRender(toggle))
        , []);
        const jsx = eff.watch(() => component(props, context));
        useEffect(() => eff.dispose, []);
        return jsx;
    }
    wrapped.displayName = component.displayName;
    const actualOpt = {
        ...defaultOptions,
        ...options
    };
    
    return actualOpt.memo
        ? React.memo(wrapped)
        : wrapped;
}

// order matters here, otherwise useCreateQuark will infer a result type of Quark<() => ...> when attempting to create derivations
export function useCreateQuark<T>(computation: () => T, deps?: React.DependencyList, options?: QuarkOptions<T>): Signal<T>
export function useCreateQuark<T>(value: T, options?: QuarkOptions<T>): Quark<T>;

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