import NoStandalone from "components/pages/NoStandalone";
import { useFirstRender } from "helpers/hooks/useFirstRender";
import React, { useContext, useMemo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import isMobile from "ismobilejs";

export type Breakpoint = "mobile" | "desktop";

const BreakpointContext = React.createContext<Breakpoint>(undefined!);

export function useBreakpoint(): Breakpoint {
	const device = useContext(BreakpointContext);
	if (device === undefined) {
		throw new Error("useDevice can only be used inside a DeviceContext!");
	}
	return device;
}

const DeviceContext = React.createContext<ReturnType<typeof isMobile>>(
	undefined!
);

export function useDevice() {
	return useContext(DeviceContext);
}

type DeviceManagerProps = React.PropsWithChildren<{
	userAgent?: string;
}>;

const breakpoints: Record<Breakpoint, number> = {
	mobile: 0,
	desktop: 768,
};

export function DeviceManager({ userAgent, children }: DeviceManagerProps) {
	const { observe, currentBreakpoint } = useDimensions({
		breakpoints,
		updateOnBreakpointChange: true,
	});
	// TODO: how does this handle undefined User-Agents?
	const deviceInfo = useMemo(() => isMobile(userAgent), [userAgent]);
	const initialBreakpoint = deviceInfo.any ? "mobile" : "desktop";

	const firstRender = useFirstRender();
	const bp = firstRender
		? initialBreakpoint
		: (currentBreakpoint as Breakpoint);

	return (
		<DeviceContext.Provider value={deviceInfo}>
			<BreakpointContext.Provider value={bp}>
				<div
					ref={observe}
					className="flex h-screen w-screen flex-col items-end"
				>
					<div
						id={
							bp === "mobile" && process.env.NODE_ENV !== "development"
								? "standalone"
								: ""
						}
						className="h-full w-full"
					>
						{/* Here goes the Component + ShellMobile part */}
						{children}
					</div>

					{bp === "mobile" && process.env.NODE_ENV !== "development" && (
						<div id="no-standalone" className="z-full">
							<NoStandalone />
						</div>
					)}
				</div>
			</BreakpointContext.Provider>
		</DeviceContext.Provider>
	);
}
