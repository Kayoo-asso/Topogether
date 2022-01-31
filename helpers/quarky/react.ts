import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { batch, ObserverEffect, observerEffect, selectQuark, SelectQuark, selectSignal, SelectSignal, SelectSignalNullable, setBatchingBehavior } from ".";
import { Quark, derive, quark, QuarkOptions, untrack, Signal, SelectQuarkNullable } from "./quarky";

setBatchingBehavior(ReactDOM.unstable_batchedUpdates);

export interface WatchDependenciesOptions<T> {
  memo?: boolean | ((prevProps: Readonly<React.PropsWithChildren<T>>, nextProps: Readonly<React.PropsWithChildren<T>>) => boolean),
}

export function watchDependencies<T>(component: React.FunctionComponent<T>, options?: WatchDependenciesOptions<T>) {
  const wrapped = (props: T, context?: any) => {
    // symbols are always unique
    const [, forceRender] = useState(Symbol());
    // the forceRender will be invoked by the state management lib on update
    const observer = useMemo(() =>
      observerEffect(() => forceRender(Symbol()))
      , []);
    useEffect(() => observer.dispose, []);

    // this produces the React nodes, while registering dependencies with the state management lib
    const nodes = observer.watch(() => component(props, context));
    // ... log the React nodes
    return nodes;
  }

  if (!options || options.memo === true) return React.memo(wrapped);
  // here options.memo is necessarily a function
  if (options.memo) return React.memo(wrapped, options.memo);
  return wrapped;
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

export function useQuarkyCallback<T>(callback: (input: T) => void, deps: React.DependencyList): (input: T) => void {
  return useCallback((input: T) => {
    batch(() => callback(input))
  }, deps);
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