import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import React from "react";
import { LightGrade } from "types";

// Note: removed `clickable?` from props, since it's equivalent
// to having an onClick handler or not
interface GradeCircleProps {
	grade: LightGrade;
	size?: "little" | "normal" | "big";
	selected?: boolean;
	content?: string;
	className?: string;
	onClick?: (grade: LightGrade) => void;
}

const notSelectedColorStyles = {
	3: "border-grade-3 text-grade-3",
	4: "border-grade-4 text-grade-4",
	5: "border-grade-5 text-grade-5",
	6: "border-grade-6 text-grade-6",
	7: "border-grade-7 text-grade-7",
	8: "border-grade-8 text-grade-8",
	9: "border-grade-9 text-grade-9",
	P: "border-grey-light text-grey-light",
};

const selectedColorStyles = {
	3: "bg-grade-3 border-grade-3 text-white",
	4: "bg-grade-4 border-grade-4 text-white",
	5: "bg-grade-5 border-grade-5 text-white",
	6: "bg-grade-6 border-grade-6 text-white",
	7: "bg-grade-7 border-grade-7 text-white",
	8: "bg-grade-8 border-grade-8 text-white",
	9: "bg-grade-9 border-grade-9 text-white",
	P: "bg-grey-light border-grey-light text-white",
};

export const GradeCircle: React.FC<GradeCircleProps> = ({
	selected = true,
	size = "normal",
	...props
}: GradeCircleProps) => {
	const bp = useBreakpoint();
	const colorStyles = selected
		? selectedColorStyles[props.grade]
		: notSelectedColorStyles[props.grade];

	const sizeStyles =
		size === "big"
			? "p-3 w-6 h-6 border-2"
			: size === "little"
			? "p-1 w-5 h-5 border-2"
			: "p-2 w-6 h-6 border-2";

	const content = props.content || props.grade;

	return (
		<div
			className={`\ relative box-border flex items-center justify-center rounded-full text-center
      ${colorStyles} ${sizeStyles} ${props.className ? props.className : ""}${
				(props.onClick && bp === 'desktop') ? " cursor-pointer" : " cursor-default"
			}`}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				props.onClick && props.onClick(props.grade);
			}}
			onKeyUp={() => props.onClick && props.onClick(props.grade)}
			role={props.onClick ? "button" : "contentinfo"}
			tabIndex={0}
		>
			<span
				className={`ktext-base-little 
					${size === 'little' ? 'text-xxs' : 'text-xs'}
					${(props.onClick && bp === 'desktop') ? " cursor-pointer" : ""}
				`}
			>
				{content}
			</span>
		</div>
	);
};
