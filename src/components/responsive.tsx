import { useBreakpoint } from "./providers/DeviceProvider";

export function Mobile({ children }: React.PropsWithChildren) {
	const breakpoint = useBreakpoint();
	return breakpoint.isMobile ? <>{children}</> : null;
}

export function Desktop({ children }: React.PropsWithChildren) {
	const breakpoint = useBreakpoint();
	return breakpoint.isDesktop ? <>{children}</> : null;
}
