/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback } from "react";
import Checked from "assets/icons/checked.svg";

interface CheckboxProps {
	checked?: boolean;
	label?: string;
	className?: string;
	onClick: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	checked = false,
	...props
}: CheckboxProps) => {
	const handleClick = useCallback(() => {
		props.onClick(!checked);
	}, [props]);

	const iconOpacity = checked ? "opacity-100" : "opacity-0";
	const rotation = checked ? "rotate-0" : "rotate-90";
	const containerOpacity = !checked ? "opacity-100" : "opacity-0";

	return (
		<div
			className={`flex flex-row space-between cursor-pointer ${props.className}`}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					handleClick();
				}
			}}
			role="checkbox"
			tabIndex={0}
		>
			<div className="relative h-5 w-5">
				<div
					className={`absolute h-5 w-5 stroke-dark rounded-[0.2rem] 
          border-2 border-dark ${containerOpacity} ${rotation} transition-all`}
				/>
				<Checked
					className={`absolute h-5 w-5 stroke-main transition-opacity ${iconOpacity}`}
				/>
			</div>
			<label
				htmlFor="1"
				className="ktext-base main inline-block ml-2 cursor-pointer leading-6"
			>
				{props.label}
			</label>
		</div>
	);
};

Checkbox.displayName = "Checkbox";
