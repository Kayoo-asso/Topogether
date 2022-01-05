import { watchDependencies } from "helpers/quarky";
import React from "react";

// Assumption: the children and fallback are always the same
// Using two components here allows us to only rerender when the actual truthiness of the value changed
export interface ShowProps<T> {
    when: () => T | null | undefined,
    fallback?: JSX.Element,
    children: JSX.Element | ((item: T) => JSX.Element),
}

interface EvaluatedProps {
    when: any,
    fallback?: JSX.Element,
}

const ShowNested = (props: React.PropsWithChildren<EvaluatedProps>) =>
    <>{props.when ? props.children : (props.fallback ?? null) }</>

const NestedMemo = React.memo(ShowNested, (a, b) => a.when !== b.when);

function ShowComponent<T>(props: React.PropsWithChildren<ShowProps<T>>) {
    let when: boolean | T | null | undefined;
    let content: JSX.Element | null;
    if (typeof props.children === "function") {
        when = props.when();
        content = when ? props.children(when) : null;
    } else {
        when = !!props.when();
        content = props.children as JSX.Element;
    }
    return (
        <NestedMemo when={!!props.when()} fallback={props.fallback}>
            {content}
        </NestedMemo>
    );
}

export const Show = watchDependencies(ShowComponent, { memo: false });