import React, { useEffect } from "react";

export interface LivenessRef {
    current: boolean,
}

/**
 * A simple wrapper around useEffect that provides a liveness variable, to guard against
 * race conditions when setting state or trying to have an effect after the component
 * was unmounted.
 * Adapted from: https://flufd.github.io/avoiding-race-conditions-use-current-effect/
 * 
 * @param  {(isAlive:LivenessRef)=>React.EffectCallback} effect - The effect to run
 * @param  {React.DependencyList} deps - Dependencies for useEffect
 */

export function useAsyncEffect(
    effect: (isAlive: LivenessRef) => void | React.EffectCallback,
    deps: React.DependencyList
) {
    useEffect(() => {
        const isAlive = {
            current: true
        };

        const cleanup = effect(isAlive);
        
        return () => {
            isAlive.current = false;
            cleanup && cleanup()
        }
    }, deps)
}
