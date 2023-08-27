import NoStandalone from "~/components/layout/NoStandalone";
import React, { useContext, useEffect, useMemo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import isMobile from "ismobilejs";
import { classNames } from "~/utils";

export type Breakpoint = {
	isMobile: boolean;
	isDesktop: boolean;
};

const BreakpointContext = React.createContext<Breakpoint>(undefined!);

export function useBreakpoint() {
	const device = useContext(BreakpointContext);
	if (device === undefined) {
		throw new Error("useBreakpoint used outside a BreakpointContext");
	}
	return device;
}
// On first render, render both sides of the app
let globalBreakpoint: Breakpoint = {
	isMobile: true,
	isDesktop: true,
};

export function getBreakpoint(): Breakpoint {
	return globalBreakpoint;
}

type DeviceInfo = ReturnType<typeof isMobile>;

const DeviceContext = React.createContext<DeviceInfo | null | undefined>(
	undefined
);

// Note: keep in sync with how device info is obtained in the provider
export function getDevice() {
	return typeof window !== "undefined" ? isMobile(navigator.userAgent) : null;
}

export function useDevice() {
	const value = useContext(DeviceContext);
	if (value === undefined) {
		throw new Error("useDevice used outside of DeviceProvider");
	}
	return value;
}

const breakpoints = {
	mobile: 0,
	desktop: 768,
};

export function DeviceProvider({ children }: React.PropsWithChildren<{}>) {
	const [breakpoint, setBreakpoint] = useState({
		isMobile: true,
		isDesktop: true,
	});
	const { observe } = useDimensions({
		breakpoints,
		onResize(ev) {
			const newBreakpoint = {
				isMobile: ev.currentBreakpoint === "mobile",
				isDesktop: ev.currentBreakpoint === "desktop",
			};
			if (
				breakpoint.isMobile !== newBreakpoint.isMobile ||
				breakpoint.isDesktop !== newBreakpoint.isDesktop
			) {
				globalBreakpoint = newBreakpoint;
				setBreakpoint(newBreakpoint);
			}
		},
	});


	// Note: keep in sync with how device info is obtained in `getDevice`
	const deviceInfo = useMemo(
		() =>
			typeof window !== "undefined" ? isMobile(navigator.userAgent) : null,
		[]
	);

	return (
		<DeviceContext.Provider value={deviceInfo}>
			<BreakpointContext.Provider value={breakpoint}>
				<div
					ref={observe}
					className="flex h-screen w-screen flex-col items-end"
				>
					<div
						className={classNames(
							"h-full w-full",
							breakpoint.isMobile &&
								process.env.NODE_ENV !== "development" &&
								"standalone"
						)}
					>
						{/* Here goes the Component + ShellMobile part */}
						{children}
					</div>

					{breakpoint.isMobile && process.env.NODE_ENV !== "development" && (
						<div className="no-standalone z-full">
							<NoStandalone />
						</div>
					)}
				</div>
			</BreakpointContext.Provider>
		</DeviceContext.Provider>
	);
}
