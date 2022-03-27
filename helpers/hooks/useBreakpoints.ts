import { DeviceContext } from "helpers/context";
import { useContext } from "react";
import { Breakpoint } from "types";

export function useBreakpoint(): Breakpoint {
    const device = useContext(DeviceContext);
    if(device === undefined) {
        throw new Error("useBreakpoint can only be used inside a DeviceContext!");
    }
    return device === "MOBILE"
        ? "sm"
        : "xl";
}