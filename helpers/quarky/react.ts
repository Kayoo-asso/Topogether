import React, { useState, useMemo, useEffect} from "react";
import ReactDOM from "react-dom";
import { observerEffect, selectQuark, SelectQuark, selectSignal, SelectSignal, SelectSignalNullable, setBatchUpdates } from ".";
import { Quark, derive, quark, QuarkOptions, untrack, Signal, SelectQuarkNullable } from "./quarky";

setBatchUpdates(ReactDOM.unstable_batchedUpdates);

export interface WatchDependenciesOptions {
    memo?: boolean
}

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
    
    return !options || options.memo
        ? React.memo(wrapped)
        : wrapped;
}


// useCreateQuark and useCreateDerivation have to be 2 separate hooks,
// to allow the creation of quarks that store functions
export function useCreateQuark<T>(value: T, options?: QuarkOptions<T>): Quark<T> {
    return useMemo(() => quark(value, options), [])
}

export function useCreateDerivation<T>(computation: () => T, deps?: React.DependencyList, options?: QuarkOptions<T>): Signal<T> {
    return useMemo(() => derive(computation, options), deps);
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