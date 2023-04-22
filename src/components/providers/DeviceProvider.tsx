import NoStandalone from "~/components/layout/NoStandalone";
import { useFirstRender } from "~/hooks";
import React, { useContext, useMemo } from "react";
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

type DeviceInfo = ReturnType<typeof isMobile>;

const DeviceContext = React.createContext<DeviceInfo | null | undefined>(
	undefined
);

export function useDevice() {
	const value = useContext(DeviceContext);
	if (value === undefined) {
		throw new Error("useDevice used outside of DeviceProvider");
	}
	return value;
}

const breakpoints: Record<Breakpoint, number> = {
	mobile: 0,
	desktop: 800,
};

export function DeviceProvider({ children }: React.PropsWithChildren<{}>) {
	const { observe, currentBreakpoint } = useDimensions({
		breakpoints,
		updateOnBreakpointChange: true,
	});
	const deviceInfo = useMemo(
		() =>
			typeof window !== "undefined" ? isMobile(navigator.userAgent) : null,
		[]
	);
	const initialBreakpoint = deviceInfo?.any ? "mobile" : "desktop";

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
						className={
							"h-full w-full" +
							(bp === "mobile" && process.env.NODE_ENV !== "development"
								? " standalone"
								: "")
						}
					>
						{/* Here goes the Component + ShellMobile part */}
						{children}
					</div>

					{bp === "mobile" && process.env.NODE_ENV !== "development" && (
						<div className="no-standalone z-full">
							<NoStandalone />
						</div>
					)}
				</div>
			</BreakpointContext.Provider>
		</DeviceContext.Provider>
	);
}
