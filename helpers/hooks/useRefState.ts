import { useRef, useState } from 'react';

// cf. https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
export const useRefState = (value: any, isProp = false) => {
  const ref = useRef(value);
  const [, forceRender] = useState(false);

  const updateState = (newState: any) => {
    if (!Object.is(ref.current, newState)) {
      ref.current = newState;
      forceRender((s) => !s);
    }
  };

  if (isProp) {
    ref.current = value;
    return ref;
  }

  return [ref, updateState];
};
