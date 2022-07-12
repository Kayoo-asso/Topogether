import React, { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	className: string;
}

export const Card: React.FC<CardProps> = (props: CardProps) => (
	<div
		className={`m-2 flex h-[140px] w-[140px] rounded-lg overflow-hidden shadow md:m-3 md:h-56 md:w-72 ${props.className}`}
	>
		{props.children}
	</div>
);
