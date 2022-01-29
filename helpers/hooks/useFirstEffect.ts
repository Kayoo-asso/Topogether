import React, { EffectCallback, useEffect, useRef, useState } from "react";

let someoneExists = false;

export function useFirstEffect(effect: EffectCallback) {
    // isFirst will contain the initial value for this call
    const isFirst = useRef(!someoneExists);

    // isFirst.current always keeps the same value for the lifetime of the component,
    // so this conditional respects the rules of Hooks
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


export function useContextMenu(setOpen: (open: boolean) => void) {
    useFirstEffect(() => {
        const onMouseDown = (e: MouseEvent) => { setOpen(false) };
        const onContextMenu = (e: MouseEvent) => { setOpen(false) };
        document.addEventListener("mousedown", onMouseDown, { capture: true })
        document.addEventListener("contextmenu", onContextMenu, { capture: true });

        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("contextmenu", onContextMenu);
        }
    });
}