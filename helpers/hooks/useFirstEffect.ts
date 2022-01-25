import { EffectCallback, useEffect, useRef } from "react";

let someoneExists = false;
export function useFirstEffect(effect: EffectCallback) {
    // useRef 
    const isFirst = useRef(!someoneExists);
    if (isFirst.current) {
        someoneExists = true;

        return useEffect(() => {
            const cleanup = effect();
            return () => {
                if (cleanup) cleanup();
                someoneExists = false;
            }
        }, []);
    }
}