import React from "react";

interface RoundButtonProps {
	white?: boolean;
	buttonSize?: number;
	className?: string;
	onClick?: () => void;
};

export function RoundButton({
	white = true,
	buttonSize = 60,
	className = "",
	// iconSizeClass = 'h-6 w-6',
	...props
}: React.PropsWithChildren<RoundButtonProps>) {
	return (
		<button
			className={`flex items-center justify-center rounded-full shadow ${
				white ? "bg-white" : "bg-main"
			} ${className ? className : "z-40"}`}
			style={{ height: buttonSize + "px", width: buttonSize + "px" }}
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				props.onClick && props.onClick();
			}}
		>
			{props.children}
		</button>
	);
}
