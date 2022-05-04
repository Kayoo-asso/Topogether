import React, { useCallback, useEffect, useState } from 'react';
import { Portal } from './useModal';

export function useContextMenu(close: () => void, container?: HTMLElement | null) {
    useEffect(() => {
        const onScroll = (e: Event) => e.preventDefault();
        const onMouseDown = (e: MouseEvent) => {
            close();
            container?.removeEventListener('wheel', onScroll);
        };
        const onTouch = (e: TouchEvent) => {
            close();
        };
        const onContextMenu = (e: MouseEvent) => {
            close();
            container?.addEventListener('wheel', onScroll);
            if (process.env.NODE_ENV === "production") e.preventDefault();
        };
        document.addEventListener('mousedown', onMouseDown, { capture: false });
        document.addEventListener('contextmenu', onContextMenu, { capture: true });
        document.addEventListener('touchstart', onTouch, { capture: true });

        return () => {
            document.removeEventListener('mousedown', onMouseDown, { capture: true });
            document.removeEventListener('contextmenu', onContextMenu, { capture: true });
            document.removeEventListener('touchstart', onTouch, { capture: true });
        };
    }, [container, close]);
}

export type ContextMenuTargetProps = React.PropsWithChildren<{
    id: string
}>;

export type ContextMenuProps = React.PropsWithChildren<{
    id: string
}>;

const openers: Map<string, React.MouseEventHandler<HTMLDivElement>> = new Map();

export const ContextMenuTarget: React.FC<ContextMenuTargetProps> = ({ id, children }) => (
    <div onContextMenu={openers.get(id)}>
        {children}
    </div>
);

export const ContextMenu: React.FC<ContextMenuProps> = ({ id, children }) => {
    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (openers.has(id)) {
            throw new Error("Detected two context menus with the same ID: " + id);
        }
        const onContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.preventDefault();
            setAnchor({
                x: event.pageX,
                y: event.pageY
            })
            setOpen(true);
        };
        // TODO: document event listeners to close the context menu
        openers.set(id, onContextMenu);
    }, []);

    return null;
    // return <Portal
}

export function useContextMenu2() {
    const Trigger = useCallback(() => {

    }, []);
}
