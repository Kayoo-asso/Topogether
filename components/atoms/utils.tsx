
import { watchDependencies } from "helpers/quarky";

type NonNullableValues<T> = T extends Array<unknown> | ReadonlyArray<unknown>
    ? NonNullObject<T>
    : NonNullable<T>;

type NonNullObject<T> = {
    [K in keyof T]: NonNullable<T[K]>
}

// Assumption: the children and fallback are always the same
// Using two components here allows us to only rerender when the actual truthiness of the value changed
export interface ShowProps<T> {
    when: () => T,
    fallback?: JSX.Element,
    children: JSX.Element | ((item: NonNullableValues<T>) => JSX.Element),
}

function Component({ when, fallback, children}: ShowPropsInternal) {
    let result = when();
    let showContent = true;
    if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i++) {
            showContent && (showContent = !!result[i]);
        }
    } else {
        showContent = !!result;
    }
    if (!showContent) {
        return fallback ?? null;
    }
    if (typeof children === "function") {
        return children(result);
    }
    return children;
}

Component.displayName = "Show";

export function Show<T>(props: ShowProps<T>): JSX.Element | null {
    // the result of watchDependencies is invokable iff the option `memo` is set to false
    // (the result of React.memo is not invokable)
    return watchDependencies<ShowProps<T>>(Component, { memo: false })(props as ShowPropsInternal);
}

// Remember to handle both the array and non-array case
export type ShowPropsInternal = {
    when: () => any,
    fallback?: JSX.Element,
    children: JSX.Element | ((item: any) => JSX.Element),
}

export interface ForProps<T> {
    each: () => readonly T[],
    fallback?: JSX.Element,
    children: (item: T) => JSX.Element,
}

function ForComponent<T>(props: ForProps<T>) {
    const list = props.each();
    if (list.length === 0 && props.fallback) return props.fallback;
    return (<>
        {list.map(props.children)}
    </>)
}

ForComponent.displayName = "For";

export function For<T>(props: ForProps<T>) {
    return watchDependencies<ForProps<T>>(ForComponent, { memo: false })(props);
};