import React from "react";
import { ToolSelectorMobile } from "./ToolSelectorMobile";
import { Grade, gradeToLightGrade } from "types";
import { getLightGradeColorClass, GradeSelector } from "./GradeSelector";
import { useDrawerStore } from "components/store/drawerStore";

import Clear from "assets/icons/clear.svg";
import Rewind from "assets/icons/rewind.svg";
import Eraser from "assets/icons/eraser.svg";
import ManyTracks from "assets/icons/many-tracks.svg";
import Track from "assets/icons/track.svg";
import Hand from "assets/icons/hand.svg";
import ClimbingShoe from "assets/icons/climbing-shoe.svg";
import ForbiddenArea from "assets/icons/forbidden-area.svg";
import Checked from "assets/icons/checked.svg";
import Circle from "assets/icons/circle.svg";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";

interface ToolbarProps {
	onClear: () => void;
	onRewind: () => void;
}

const getStrokeColorClass = (g: Grade | undefined) => {
	if (!g) return "stroke-grey-light";
	else {
		const lightGrade = gradeToLightGrade(g);
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

export const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
	const selectedTool = useDrawerStore(d => d.selectedTool);
	const selectTool = useDrawerStore(d => d.selectTool);
	const isOtherTracksDisplayed = useDrawerStore(d => d.isOtherTracksDisplayed);
	const toggleOtherTracks = useDrawerStore(d => d.toggleOtherTracks);
	const openGradeSelector = useDrawerStore(d => d.openGradeSelector);
	const closeDrawer = useDrawerStore(d => d.closeDrawer)

	const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
    const grade = selectedBoulder.selectedTrack!().grade;

	return (
		<div className="z-200 flex h-[9vh] w-full flex-row items-center justify-center bg-dark">
			<span className="flex w-2/5 flex-row items-center justify-around md:w-3/12">
				<Clear
					className="h-8 w-8 md:cursor-pointer stroke-white"
					onClick={props.onClear}
				/>
				<Rewind
					className="h-6 w-6 md:cursor-pointer stroke-white"
					onClick={props.onRewind}
				/>
				<div className="hidden md:block">
					<Eraser
						className={
							"h-6 w-6 md:cursor-pointer " +
							(selectedTool === "ERASER"
								? "fill-main stroke-main"
								: "fill-white stroke-white")
						}
						onClick={() => selectTool("ERASER")}
					/>
				</div>
				<ManyTracks
					className={
						"h-6 w-6 md:cursor-pointer " +
						(isOtherTracksDisplayed ? "stroke-main" : "stroke-white")
					}
					onClick={toggleOtherTracks}
				/>
			</span>

			<span className="1/5 mx-3 flex self-end pb-4 md:hidden">
				<ToolSelectorMobile
					selectedTool={
						selectedTool !== "ERASER" ? selectedTool : "LINE_DRAWER"
					}
					onToolSelect={selectTool}
				/>
			</span>

			<span className="hidden w-6/12 flex-row items-center justify-around px-[13%] md:flex">
				<Track
					className={
						"h-6 w-6 md:cursor-pointer " +
						(selectedTool === "LINE_DRAWER"
							? getStrokeColorClass(grade)
							: "stroke-white")
					}
					onClick={() => selectTool("LINE_DRAWER")}
				/>
				<Hand
					className={
						"h-6 w-6 md:cursor-pointer " +
						(selectedTool === "HAND_DEPARTURE_DRAWER"
							? getStrokeColorClass(grade) + " fill-white"
							: "stroke-white")
					}
					onClick={() => selectTool("HAND_DEPARTURE_DRAWER")}
				/>
				<ClimbingShoe
					className={
						"h-7 w-7 md:cursor-pointer " +
						(selectedTool === "FOOT_DEPARTURE_DRAWER"
							? getStrokeColorClass(grade) + " fill-white"
							: "stroke-white")
					}
					onClick={() => selectTool("FOOT_DEPARTURE_DRAWER")}
				/>
				<ForbiddenArea
					className={
						"h-6 w-6 md:cursor-pointer " +
						(selectedTool === "FORBIDDEN_AREA_DRAWER"
							? "fill-white stroke-second"
							: "stroke-white")
					}
					onClick={() => selectTool("FORBIDDEN_AREA_DRAWER")}
				/>
			</span>

			<span
				className="flex text-white flex-row items-center md:cursor-pointer"
				onClick={openGradeSelector}
			>
				<Circle className={"mr-2 h-6 w-6 " + getLightGradeColorClass(gradeToLightGrade(grade))} />
				{grade ? grade : 'Pr'}
			</span>

			<span className="flex w-1/5 justify-center md:hidden">
				<Checked
					className="h-6 w-6 md:cursor-pointer fill-main"
					onClick={closeDrawer}
				/>
			</span>

			<GradeSelector />
		</div>
	);
};

Toolbar.displayName = "Toolbar";