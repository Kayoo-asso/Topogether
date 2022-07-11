import React, { useEffect, useState } from "react";

interface SlideoverLeftDesktopProps {
	open?: boolean;
	onClose?: () => void;
	title?: string;
	className?: string;
	children?: React.ReactNode;
}

export const SlideoverLeftDesktop: React.FC<SlideoverLeftDesktopProps> = ({
	open = false,
	...props
}: SlideoverLeftDesktopProps) => {
	const [translateX, setTranslateX] = useState<number>(100);

	useEffect(() => {
		window.setTimeout(() => setTranslateX(open ? 0 : 100), 1);
	}, [open]);

	return (
		<div
			className={`absolute left-[280px] flex h-contentPlusShell w-[600px] flex-col border-r border-grey-medium bg-white px-8 py-5 transition ease-in-out ${
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
					onClick={() => {
						setTranslateX(100);
						window.setTimeout(() => props.onClose && props.onClose(), 150);
					}}
				>
					Terminé
				</span>
			</div>

			<div className="h-full flex-1 overflow-auto">{props.children}</div>
		</div>
	);
};
