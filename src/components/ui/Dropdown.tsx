import React, { useEffect, useRef, useState } from "react";
import equal from "fast-deep-equal/es6";
import { classNames } from "~/utils";
import Link from "next/link";

export interface DropdownOption {
	// value: any;
	label: string;
	// section?: boolean;
	// icon?: SVG;
	href: string | URL;
	// action?: (e: React.PointerEvent<HTMLDivElement>) => void;
	// disabled?: boolean;
}

interface DropdownProps {
	// position?: { x: number; y: number };
	className?: string;
	options: DropdownOption[];
	onSelect?: (option: DropdownOption) => void;
	// type?: string;
}

interface Position {
	x: number;
	y: number;
}

export const Dropdown: React.FC<DropdownProps> = React.memo(
	({ className = "", ...props }: DropdownProps) => {
		const ref = useRef<HTMLDivElement>(null);
		const [position, setPosition] = useState<Position>();

		useEffect(() => {
			if (ref.current && position) {
				if (
					ref.current.clientHeight + position.y >
					document.documentElement.clientHeight
				) {
					setPosition({
						y: position.y - ref.current.clientHeight - 10,
						x: position.x,
					});
				}
				if (
					ref.current.clientWidth + position.x >
					document.documentElement.clientWidth
				) {
					setPosition({
						y: position.y,
						x: position.x - ref.current.clientWidth - 50,
					});
				}
			}
		}, [ref, position]);

		return (
			<div
				ref={ref}
				className={classNames(
					"absolute z-1000 rounded bg-white px-7 shadow",
					className
				)}
				style={{ left: `${position?.x}px`, top: `${position?.y}px` }}
			>
				{props.options.map((opt, i) => (
					<Link
						key={opt.href.toString()}
						href={opt.href}
						className="h-16 ktext-base flex flex-row items-center text-dark"
					>
						{opt.label}
					</Link>
				))}
			</div>
		);
	},
	equal
);

Dropdown.displayName = "Dropdown";
