import { watchDependencies } from "helpers/quarky";

export interface ForProps<T> {
    each: () => readonly T[],
    fallback?: JSX.Element,
    children: (item: T) => JSX.Element,
}

// TODO: test to see if users can put keys directly on the result of their function
function For<T>(props: ForProps<T>) {
    const list = props.each();
    if (list.length === 0 && props.fallback) return props.fallback;
    return (<>
        {list.map(props.children)}
    </>)
}

export default function<T>(props: ForProps<T>) {
    return watchDependencies(For)(props as any);
};