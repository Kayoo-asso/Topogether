import React from "react";
import { ToolSelectorMobile } from "./ToolSelectorMobile";
import { GradeSelector } from "./GradeSelector";
import { DrawerToolEnum, Grade, gradeToLightGrade } from "types";
import Clear from "assets/icons/clear.svg";
import Rewind from "assets/icons/rewind.svg";
import Eraser from "assets/icons/eraser.svg";
import ManyTracks from "assets/icons/many-tracks.svg";
import Topo from "assets/icons/topo.svg";
import Hand from "assets/icons/hand.svg";
import ClimbingShoe from "assets/icons/climbing-shoe.svg";
import ForbiddenArea from "assets/icons/forbidden-area.svg";
import Checked from "assets/icons/checked.svg";

interface ToolbarProps {
	selectedTool: DrawerToolEnum;
	displayOtherTracks: boolean;
	grade?: Grade;
	gradeSelectorOpen: boolean;
	setGradeSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onToolSelect: (tool: DrawerToolEnum) => void;
	onGradeSelect: (grade: Grade) => void;
	onClear: () => void;
	onRewind: () => void;
	onOtherTracks: () => void;
	onValidate: () => void;
}

const getStrokeColorClass = (grade: Grade | undefined) => {
	if (!grade) return "stroke-grey-light";
	else {
		const lightGrade = gradeToLightGrade(grade);
		switch (lightGrade) {
			case 3:
				return "stroke-grade-3";
			case 4:
				return "stroke-grade-4";
			case 5:
				return "stroke-grade-5";
			case 6:
				return "stroke-grade-6";
			case 7:
				return "stroke-grade-7";
			case 8:
				return "stroke-grade-8";
			case 9:
				return "stroke-grade-9";
		}
	}
};

export const Toolbar: React.FC<ToolbarProps> = ({
	selectedTool = "LINE_DRAWER",
	...props
}: ToolbarProps) => {
	return (
		<div className="z-200 flex h-[9vh] w-full flex-row items-center justify-center bg-dark">
			<span className="flex w-2/5 flex-row items-center justify-around md:w-3/12">
				<Clear
					className="h-8 w-8 cursor-pointer stroke-white"
					onClick={props.onClear}
				/>
				<Rewind
					className="h-6 w-6 cursor-pointer stroke-white"
					onClick={props.onRewind}
				/>
				<div className="hidden md:block">
					<Eraser
						className={
							"h-6 w-6 cursor-pointer " +
							(selectedTool === "ERASER"
								? "fill-main stroke-main"
								: "fill-white stroke-white")
						}
						onClick={() => props.onToolSelect("ERASER")}
					/>
				</div>
				<ManyTracks
					className={
						"h-6 w-6 cursor-pointer " +
						(props.displayOtherTracks ? "stroke-main" : "stroke-white")
					}
					onClick={props.onOtherTracks}
				/>
			</span>

			<span className="1/5 mx-3 flex self-end pb-4 md:hidden">
				<ToolSelectorMobile
					selectedTool={
						selectedTool !== "ERASER" ? selectedTool : "LINE_DRAWER"
					}
					onToolSelect={props.onToolSelect}
				/>
			</span>

			<span className="hidden w-6/12 flex-row items-center justify-around px-[13%] md:flex">
				<Topo
					className={
						"h-6 w-6 cursor-pointer " +
						(selectedTool === "LINE_DRAWER"
							? getStrokeColorClass(props.grade)
							: "stroke-white")
					}
					onClick={() => props.onToolSelect("LINE_DRAWER")}
				/>
				<Hand
					className={
						"h-6 w-6 cursor-pointer " +
						(selectedTool === "HAND_DEPARTURE_DRAWER"
							? getStrokeColorClass(props.grade) + " fill-white"
							: "stroke-white")
					}
					onClick={() => props.onToolSelect("HAND_DEPARTURE_DRAWER")}
				/>
				<ClimbingShoe
					className={
						"h-7 w-7 cursor-pointer " +
						(selectedTool === "FOOT_DEPARTURE_DRAWER"
							? getStrokeColorClass(props.grade) + " fill-white"
							: "stroke-white")
					}
					onClick={() => props.onToolSelect("FOOT_DEPARTURE_DRAWER")}
				/>
				<ForbiddenArea
					className={
						"h-6 w-6 cursor-pointer " +
						(selectedTool === "FORBIDDEN_AREA_DRAWER"
							? "fill-white stroke-second"
							: "stroke-white")
					}
					onClick={() => props.onToolSelect("FORBIDDEN_AREA_DRAWER")}
				/>
			</span>

			<span className="z-100 w-1/5 md:flex md:w-3/12 md:justify-center">
				<GradeSelector
					open={props.gradeSelectorOpen}
					setOpen={props.setGradeSelectorOpen}
					grade={props.grade}
					onGradeSelect={props.onGradeSelect}
				/>
			</span>

			<span className="flex w-1/5 justify-center md:hidden">
				<Checked
					className="h-6 w-6 cursor-pointer fill-main"
					onClick={props.onValidate}
				/>
			</span>
		</div>
	);
};
