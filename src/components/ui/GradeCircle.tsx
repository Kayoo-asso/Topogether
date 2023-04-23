import React from "react";
import { LightGrade } from "types";
import { classNames } from "~/utils";

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

const sizeStyles = {
  big: "p-3 w-6 h-6 border-2",
  normal: "p-2 w-6 h-6 border-2",
  little: "p-1 w-5 h-5 border-2",
}

export const GradeCircle: React.FC<GradeCircleProps> = ({
	selected = true,
	size = "normal",
	...props
}: GradeCircleProps) => {
	const colorStyles = selected
		? selectedColorStyles[props.grade]
		: notSelectedColorStyles[props.grade];

	const content = props.content || props.grade;

	return (
		<button
			className={classNames(
				"relative box-border flex items-center justify-center rounded-full text-center",
				props.className,
				colorStyles,
				sizeStyles[size]
			)}
			// Do not pass an onClick handler if `props.onClick` is undefined,
			// to have the proper cursor behavior.
			// (buttons with an `onClick` handler show a pointer cursor)
			onClick={
				props.onClick &&
				((e) => {
					e.preventDefault();
					e.stopPropagation();
					props.onClick && props.onClick(props.grade);
				})
			}
			onKeyUp={() => props.onClick && props.onClick(props.grade)}
			tabIndex={0}
		>
			<span
				className={classNames(
					"ktext-base-little",
					size === "little" ? "text-xxs" : "text-xs"
				)}
			>
				{content}
			</span>
		</button>
	);
};
