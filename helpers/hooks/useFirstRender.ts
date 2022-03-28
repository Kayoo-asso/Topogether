import { useRef } from "react";

export function useFirstRender(): boolean {
    const firstRender = useRef(true);
    if (firstRender.current) {
        firstRender.current = false;
        return true;
    }
    return false;
}