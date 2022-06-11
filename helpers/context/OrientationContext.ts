import React from 'react';

export type DeviceOrientation = {
    alpha: number | null,
    beta: number | null,
    gamma: number | null,
}

export const OrientationContext = React.createContext<DeviceOrientation | null>(null);
