import NoStandalone from "components/pages/NoStandalone";
import { useFirstRender } from "helpers/hooks/useFirstRender";
import React, { useContext, useMemo } from "react";
import useDimensions from "react-cool-dimensions";
import isMobile from "ismobilejs";
import { classNames } from "~/utils";
import { env } from "~/env.mjs";

export type Breakpoint = {
	isMobile: boolean;
	isDesktop: boolean;
};

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

const breakpoints = {
	mobile: 0,
	desktop: 800,
};

export function DeviceManager({ children }: React.PropsWithChildren<{}>) {
	const { observe, currentBreakpoint } = useDimensions({
		breakpoints,
		updateOnBreakpointChange: true,
	});

	// TODO: how does this handle undefined User-Agents?
	const deviceInfo = useMemo(() => isMobile(navigator.userAgent), []);

	const firstRender = useFirstRender();
	const bp = firstRender
		? // Initial breakpoint: render both versions of the app
		  { isMobile: true, isDesktop: true }
		: {
				isMobile: currentBreakpoint === "mobile",
				isDesktop: currentBreakpoint === "desktop",
		  };

	return (
		<DeviceContext.Provider value={deviceInfo}>
			<BreakpointContext.Provider value={bp}>
				<div
					ref={observe}
					className="h-screen w-screen"
				>
					<div
						className={classNames(
							"h-full w-full",
							bp.isMobile &&
								env.NODE_ENV !== "development" &&
								"standalone"
						)}
					>
						{/* Here goes the Component + ShellMobile part */}
						{children}
					</div>

					{bp.isMobile && env.NODE_ENV !== "development" && (
						<div className="no-standalone z-full">
							<NoStandalone />
						</div>
					)}
				</div>
			</BreakpointContext.Provider>
		</DeviceContext.Provider>
	);
}
