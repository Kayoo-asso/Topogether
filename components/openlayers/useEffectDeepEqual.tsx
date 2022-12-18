import { useEffect, EffectCallback, DependencyList, useState } from "react";
import areEqual from "fast-deep-equal/es6"

// Has the advantage of not reading / setting refs during render,
// which could cause undefined behavior in React 18.
export function useEffectDeepEqual(callback: EffectCallback, deps: DependencyList) {
  const [memoizedDeps, setMemoizedDeps] = useState(deps);
  if(!areEqual(memoizedDeps, deps)) {
    setMemoizedDeps(deps);
  }
  useEffect(callback, memoizedDeps);
}