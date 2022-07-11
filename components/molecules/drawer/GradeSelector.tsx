import React, { useEffect, useRef } from "react";
import { Grade, grades } from "types";
import Circle from "assets/icons/circle.svg";

interface GradeselectorDrawerProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	grade?: Grade;
	onGradeSelect: (grade: Grade) => void;
}

export const GradeSelector: React.FC<GradeselectorDrawerProps> = (
	props: GradeselectorDrawerProps
) => {
	const selectorContainerRef = useRef<HTMLDivElement>(null);

	const getGradeColorClass = (grade: Grade) => {
		const lightGrade = parseInt(grade[0]);
		switch (lightGrade) {
			case 3:
				return "fill-grade-3";
			case 4:
				return "fill-grade-4";
			case 5:
				return "fill-grade-5";
			case 6:
				return "fill-grade-6";
			case 7:
				return "fill-grade-7";
			case 8:
				return "fill-grade-8";
			case 9:
				return "fill-grade-9";
		}
	};

	useEffect(() => {
		if (selectorContainerRef.current) {
			selectorContainerRef.current.scrollIntoView({ behavior: "auto" });
		}
	}, [selectorContainerRef, props.open]);

	return (
		<>
			<span
				className={
					"flex cursor-pointer flex-row items-center " +
					(props.grade
						? "ktext-base text-white"
						: "ktext-title text-grey-medium")
				}
				onClick={() => props.setOpen(!props.open)}
			>
				<Circle
					className={
						"mr-2 h-6 w-6 " +
						(props.grade ? getGradeColorClass(props.grade) : "fill-grey-medium")
					}
				/>
				{props.grade ? props.grade : "Diff"}
			</span>

			{props.open && (
				<div className="hide-scrollbar absolute bottom-0 right-[17%] -mb-[25px] flex h-[95%] flex-col items-start gap-5 overflow-x-hidden overflow-y-scroll rounded-t-full bg-dark pt-8 md:bottom-[7vh] md:right-[5%] md:mb-0 md:h-[82%]">
					{[...grades].reverse().map((grade) => (
						<span
							key={grade}
							className="ktext-base flex cursor-pointer flex-row items-center px-3 text-white"
							onClick={() => {
								props.onGradeSelect(grade);
								props.setOpen(false);
							}}
						>
							<Circle className={"mr-2 h-6 w-6 " + getGradeColorClass(grade)} />
							{grade}
						</span>
					))}
					<span ref={selectorContainerRef}></span>
				</div>
			)}
		</>
	);
};
