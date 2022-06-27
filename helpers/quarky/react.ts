import React, { useState, useMemo, useEffect, useCallback, useRef, EffectCallback, forwardRef, Ref, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes, ForwardRefRenderFunction, ForwardedRef, NamedExoticComponent } from "react";
import ReactDOM from "react-dom";
import { batch, ObserverEffect, observerEffect, selectQuark, SelectQuark, selectSignal, SelectSignal, SelectSignalNullable, setBatchingBehavior } from ".";
import { Quark, derive, quark, QuarkOptions, untrack, Signal, SelectQuarkNullable, effect, EvaluatedDeps } from "./quarky";

setBatchingBehavior(ReactDOM.unstable_batchedUpdates);

export interface WatchDependenciesOptions<T> {
  memo?: boolean | ((prevProps: Readonly<React.PropsWithChildren<T>>, nextProps: Readonly<React.PropsWithChildren<T>>) => boolean),
}

type FunctionComponent<P extends object> = (props: P) => React.ReactElement<any, any> | null;
type ForwardRefComponent<R, P extends object> = (props: P, ref: ForwardedRef<R>) => React.ReactElement<any, any> | null;

const isServer = typeof window === "undefined";

// Here we don't use React's types for function components or forwardRef components,
// because we want to be able to cleanly distinguish between the regular and the forwardRef cases
// by just checking the number of arguments.
// It also avoids implicitly accepting a `children` argument (included by default in all React's internal component types),
// which can cause unexpected bugs.
export function watchDependencies<P extends object>(component: FunctionComponent<P>, options?: WatchDependenciesOptions<P>): NamedExoticComponent<P>
export function watchDependencies<R, P extends object>(component: ForwardRefComponent<R, P>, options?: WatchDependenciesOptions<P>): NamedExoticComponent<P & RefAttributes<R>>
export function watchDependencies<P extends object>(component: FunctionComponent<P>, options: { memo: false}): React.FC<P>
export function watchDependencies<R, P extends object>(component: ForwardRefComponent<R, P>, options: { memo: false}): React.FC<P & RefAttributes<R>>
// Don't even try doing proper internal types for the component function
export function watchDependencies<P extends object, R = undefined>(
  component: Function,
  options?: WatchDependenciesOptions<P>
) {
  // Go faster on the server
  if (isServer) return component;

  const wrapped = (props: P, ref: ForwardedRef<R>) => {

    // symbols are always unique
    const [, forceRender] = useState(Symbol());
    // the forceRender will be invoked by the state management lib on update
    const observer = useMemo(() =>
      observerEffect(() => forceRender(Symbol()))
      , [forceRender]);
    useEffect(() => observer.dispose, [observer]);


    // this produces the React nodes, while registering dependencies with the state management lib
    // the second argument gets ignored by regular components
    const nodes = observer.watch(() => component(props, ref));
    return nodes;
  }
  const fn = component.length > 1
    ? forwardRef(wrapped)
    : wrapped as (props: P) => React.ReactElement<any, any> | null;

  if (!options || options.memo === true) return React.memo(fn);
  // here options.memo is necessarily a function
  if (options.memo) return React.memo(fn as any, options.memo);
  return wrapped;
}

// useCreateQuark and useCreateDerivation have to be 2 separate hooks,
// to allow the creation of quarks that store functions
export function useCreateQuark<T>(value: T, options?: QuarkOptions<T>): Quark<T> {
  return useMemo(() => quark(value, options), [])
}

export function useCreateDerivation<T>(computation: () => T, deps?: React.DependencyList, options?: QuarkOptions<T>): Signal<T> {
  return useMemo(() => {
    return derive(computation, options)
  }, deps);
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

export function useQuarkyCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  // Have to force TypeScript's hand here
  return useCallback(
    (...args: any[]) => batch(() => callback(...args))
  , deps) as T;
}

export function useQuarkyEffect(cb: EffectCallback, deps?: React.DependencyList) {
  useEffect(() => {
    const e = effect(cb);
    return e.dispose;
  }, deps);
}

export function useLazyQuarkyEffect<T extends Signal<any>[]>(cb: (deps: EvaluatedDeps<T>) => void, quarks: T) {
  useEffect(() => {
    const e = effect(quarks, cb, { lazy: true });
    return e.dispose
  }, []);
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