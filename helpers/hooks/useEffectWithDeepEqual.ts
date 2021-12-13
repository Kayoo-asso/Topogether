import equal from "fast-deep-equal/es6";
import { useEffect, useRef } from "react";

export function useEffectWithDeepEqual(
    callback: React.EffectCallback,
    deps: React.DependencyList
) {
    useEffect(callback, deps.map(useDeepMemo));
}

function useDeepMemo(value: unknown) {
    const ref = useRef<unknown>();
    if (!equal(value, ref.current)) {
        ref.current = value;
    }
    return ref.current;
}