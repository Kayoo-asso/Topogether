import React from 'react';

export type Device = 'mobile' | 'desktop';

export const DeviceContext = React.createContext<Device>(undefined!);
