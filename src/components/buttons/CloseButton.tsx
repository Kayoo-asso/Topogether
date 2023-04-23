import React from "react";

interface CloseButtonProps {
	className?: string;
	onClose?: () => void;
}

export function CloseButton(props: CloseButtonProps) {
	return (
		<div
			className={`ktext-section-title text-main md:cursor-pointer ${props.className}`}
			onClick={props.onClose}
		>
			X
		</div>
	);
}
