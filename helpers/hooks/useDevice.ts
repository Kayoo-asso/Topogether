import { Device, DeviceContext } from "helpers/context";
import { useContext } from "react";

export function useDevice(): Device {
    const device = useContext(DeviceContext);
    if (device === undefined) {
        throw new Error("useDevice can only be used inside a DeviceContext!");
    }
    return device;
}