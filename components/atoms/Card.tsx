import React, { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	className: string;
}

export const Card: React.FC<CardProps> = (props: CardProps) => (
	<div
		className={`m-2 w-[140px] h-[140px] md:w-72 md:h-56 md:m-3 rounded-lg shadow flex ${props.className}`}
	>
		{props.children}
	</div>
);
