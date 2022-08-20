import React from "react";

type SlideoverLeftDesktopProps = React.PropsWithChildren<{
	open: boolean;
	onClose?: () => void;
	title?: string;
	className?: string;
}>;

export const SlideoverLeftDesktop: React.FC<SlideoverLeftDesktopProps> = (props: SlideoverLeftDesktopProps) => {
	const translateX = props.open ? 0 : 100;

	return (
		<div
			className={`absolute left-[280px] flex z-300 h-contentPlusShell w-[600px] flex-col border-r border-grey-medium bg-white px-8 py-5 transition ease-in-out ${
				props.className ? props.className : ""
			}`}
			style={{
				transform: `translateX(-${translateX}%)`,
			}}
		>
			<div className="flex h-[5%] items-center justify-between">
				<span className="ktext-big-title">{props.title}</span>
				<span
					className="ktext-base cursor-pointer text-main"
					onClick={props.onClose}
				>
					Terminé
				</span>
			</div>

			<div className="h-full flex-1 overflow-auto">{props.children}</div>
		</div>
	);
};
