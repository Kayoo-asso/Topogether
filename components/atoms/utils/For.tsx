import { watchDependencies } from "helpers/quarky";

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