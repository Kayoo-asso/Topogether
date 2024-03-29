import React, { useEffect, useRef, useState } from "react";
import equal from "fast-deep-equal/es6";

export interface DropdownOption {
	value: any;
	label?: string;
	isSection?: boolean;
	action?: (e: React.PointerEvent<HTMLDivElement>) => void;
	icon?: SVG;
	disabled?: boolean;
}

interface DropdownProps {
	position?: { x: number; y: number };
	options: DropdownOption[];
	onSelect?: (option: DropdownOption) => void;
	type?: string;
	fullSize?: boolean;
	className?: string;
}

export const Dropdown: React.FC<DropdownProps> = React.memo(
	({ className = "", fullSize = false, ...props }: DropdownProps) => {
		const ref = useRef<HTMLDivElement>(null);
		const [position, setPosition] = useState(props.position);

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
				className={`absolute z-1000 bg-white px-7 shadow rounded${
					fullSize ? " w-full" : ""
				} ${className}`}
				style={{ left: `${position?.x}px`, top: `${position?.y}px` }}
				onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
			>
				{props.options.map((opt, i) =>
					opt.isSection ? (
						<div
							className={`ktext-label uppercase text-grey-medium cursor-default pb-2 mt-2 border-t-2 border-grey-light`}
							key={opt.value}
						></div>
					) : (
						<div
							className={`h-16 ${
								opt.disabled
									? "cursor-default text-grey-medium"
									: "md:cursor-pointer text-dark"
							} ktext-base flex flex-row items-center`}
							key={opt.value}
							onPointerDown={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (!opt.disabled) {
									props.onSelect && props.onSelect(opt);
									opt.action && opt.action(e);
								}
							}}
						>
							{opt.icon && (
								<opt.icon
									className={`${
										opt.disabled ? "stroke-grey-medium" : "stroke-black"
									} mr-5 h-5 w-5`}
								/>
							)}
							{opt.label || opt.value}
						</div>
					)
				)}
			</div>
		);
	},
	equal
);

Dropdown.displayName = "Dropdown";
