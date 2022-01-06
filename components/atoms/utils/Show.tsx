import { watchDependencies } from "helpers/quarky";
import React from "react";

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

interface EvaluatedProps {
    when: boolean,
    fallback?: JSX.Element,
}

const Nested = (props: React.PropsWithChildren<EvaluatedProps>) =>
    <>
        {props.when
            ? props.children
            : (props.fallback ?? null)
        }
    </>

const NestedMemo = React.memo(Nested, (a, b) => a.when !== b.when);

function Component({ when, fallback, children}: ShowPropsInternal) {
    let result = when();
    let showContent = true;
    if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i++) {
            showContent &&= !!result[i];
        }
    } else {
        showContent = !!result;
    }
    const content: JSX.Element | null = typeof children === "function"
        ? (showContent ? children(result as any) : null)
        : children;
    return (
        <NestedMemo when={showContent} fallback={fallback}>
            {content}
        </NestedMemo>
    );
}

export function Show<T>(props: ShowProps<T>): JSX.Element | null {
    return watchDependencies<ShowProps<T>>(Component, { memo: false })(props as ShowPropsInternal);
}

// Remember to handle both the array and non-array case
export type ShowPropsInternal = {
    when: () => any,
    fallback?: JSX.Element,
    children: JSX.Element | ((item: any) => JSX.Element),
}