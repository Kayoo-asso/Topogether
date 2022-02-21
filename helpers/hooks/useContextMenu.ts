import React, {
 EffectCallback, useEffect, useRef,
} from 'react';

let someoneExists = false;

export function useFirstEffect(effect: EffectCallback) {
    // isFirst will contain the initial value for this call
    const isFirst = useRef(!someoneExists);

    // isFirst.current always keeps the same value for the lifetime of the component,
    // so this conditional respects the rules of Hooks
    // if (isFirst.current) {
    //     someoneExists = true;
        console.log("first invocation of useFirstEffect");

        useEffect(() => {
            if (!someoneExists) {
                someoneExists = true;
                console.log("About to run useFirstEffect funciton");
                const cleanup = effect();
                return () => {
                    if (cleanup) cleanup();
                    someoneExists = false;
                };
            }
        }, []);
    // }
}
export function useContextMenu(close: () => void, container?: HTMLElement | null) {
    useEffect(() => {
        const onScroll = (e: Event) => e.preventDefault()
        const onMouseDown = (e: MouseEvent) => {
            close();             
            container?.removeEventListener('wheel', onScroll);
        };
        const onContextMenu = (e: MouseEvent) => {
            close();
            container?.addEventListener('wheel', onScroll);
            if(process.env.NODE_ENV === "production") e.preventDefault();
        };
        document.addEventListener('mousedown', onMouseDown, { capture: false });
        document.addEventListener('contextmenu', onContextMenu, { capture: true });

        return () => {
            document.removeEventListener('mousedown', onMouseDown, { capture: true });
            document.removeEventListener('contextmenu', onContextMenu, { capture: true });
        };
    }, [container, close]);
}
