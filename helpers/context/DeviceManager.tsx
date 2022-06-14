import { useFirstRender } from "helpers/hooks/useFirstRender";
import NoStandalone from "pages/NoStandalone";
import React from "react";
import useDimensions from "react-cool-dimensions";

export type Device = "mobile" | "desktop";

export const DeviceContext = React.createContext<Device>(undefined!);

type DeviceContextProviderProps = React.PropsWithChildren<{
  initialDevice: Device;
}>;

const breakpoints: Record<Device, number> = {
  mobile: 0,
  desktop: 768,
};

export function DeviceManager({
  initialDevice,
  children,
}: DeviceContextProviderProps) {
  const { observe, currentBreakpoint } = useDimensions({
    breakpoints,
    updateOnBreakpointChange: true,
  });

  const firstRender = useFirstRender();
  const device = firstRender ? initialDevice : (currentBreakpoint as Device);

  return (
    <DeviceContext.Provider value={device}>
      <div ref={observe} className="w-screen h-screen flex items-end flex-col">
        <div id={(device === 'mobile' && process.env.NODE_ENV !== 'development') ? "standalone" : ''} className='w-full h-full'>
          {/* Here goes the Component + ShellMobile part */}
          {children}
        </div>

        {device === 'mobile' && process.env.NODE_ENV !== 'development' &&
          <div id="no-standalone" className='z-full'>
            <NoStandalone />
          </div>
        }
      </div>
    </DeviceContext.Provider>
  );
}
