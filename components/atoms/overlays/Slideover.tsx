import { useBreakpoint } from "helpers/hooks";
import React from "react";
import { SlideoverLeftDesktop, SlideoverMobile } from ".";

type SlideoverProps = React.PropsWithChildren<{
	open: boolean;
	title: string;
	className?: string;
	onClose?: () => void;
}>;

export function Slideover({
	open,
	title,
	className,
	onClose,
	children,
}: SlideoverProps) {
	const bp = useBreakpoint();

	return (
		<>
			{bp === "mobile" && (
				<SlideoverMobile onClose={onClose}>{children}</SlideoverMobile>
			)}
			{bp !== "mobile" && (
				<SlideoverLeftDesktop
					className={className}
					title={title}
					open={open}
					onClose={onClose}
				>
					{children}
				</SlideoverLeftDesktop>
			)}
		</>
	);
}
