import { EffectCallback, useEffect, useRef } from "react";

let someoneExists = false;
export function useFirstEffect(effect: EffectCallback) {
    const isFirst = useRef(someoneExists);
    if (isFirst) {
        return useEffect(() => {
            const cleanup = effect();
            return () => {
                if (cleanup) cleanup();
                someoneExists = false;
            }
        }, []);
    }
}