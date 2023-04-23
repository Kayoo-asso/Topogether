import { useBreakpoint } from "./providers/DeviceProvider";

export function Mobile({ children }: React.PropsWithChildren) {
	const breakpoint = useBreakpoint();
	return breakpoint.isMobile ? <div className="w-full h-full block md:hidden">{children}</div> : null;
}

export function Desktop({ children }: React.PropsWithChildren) {
	const breakpoint = useBreakpoint();
	return breakpoint.isDesktop ? <div className="w-full h-full hidden md:block">{children}</div> : null;
}
