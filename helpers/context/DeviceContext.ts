import React from 'react';

export type Device = 'MOBILE' | 'TABLET' | 'DESKTOP';

export const DeviceContext = React.createContext<Device>('MOBILE');
