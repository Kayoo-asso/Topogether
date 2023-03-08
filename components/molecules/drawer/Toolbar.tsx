import React from "react";
import { ToolSelectorMobile } from "./ToolSelectorMobile";
import { TopoTypes } from "types";
import { useDrawerStore } from "components/store/drawerStore";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";

import Clear from "assets/icons/clear.svg";
import Rewind from "assets/icons/rewind.svg";
import Eraser from "assets/icons/eraser.svg";
import ManyTracks from "assets/icons/many-tracks.svg";
import Track from "assets/icons/track.svg";
import Hand from "assets/icons/hand.svg";
import ClimbingShoe from "assets/icons/climbing-shoe.svg";
import ForbiddenArea from "assets/icons/forbidden-area.svg";
import Checked from "assets/icons/checked.svg";
import { useTopoType } from "helpers/hooks/TopoTypeProvider";
import { getStrokeColorClass } from "helpers/gradeColors";

interface ToolProps {
	label: string,
	className?: string,
	onClick: () => void,
}
const Tool: React.FC<ToolProps> = (props: React.PropsWithChildren<ToolProps>) => (
	<div className={`relative group ${props.className ? props.className : ''}`}>
		<div className="hidden group-hover:block whitespace-nowrap absolute -top-12 left-1/2 transform -translate-x-1/2 text-white border border-grey-medium bg-dark rounded-full py-2 px-3">
			{props.label}
		</div>
		<div 
			className="rounded-full md:p-4 md:cursor-pointer group-hover:bg-white group-hover:bg-opacity-20"
			onClick={props.onClick}
		>
			{props.children}
		</div>
	</div>
)


interface ToolbarProps {
	onClear: () => void;
	onRewind: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
	const topoType = useTopoType();

	const selectedTool = useDrawerStore(d => d.selectedTool);
	const selectTool = useDrawerStore(d => d.selectTool);
	const isOtherTracksDisplayed = useDrawerStore(d => d.isOtherTracksDisplayed);
	const toggleOtherTracks = useDrawerStore(d => d.toggleOtherTracks);
	const closeDrawer = useDrawerStore(d => d.closeDrawer)

	const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
    const grade = selectedBoulder.selectedTrack!().grade;

	return (
		<div className="z-200 flex h-[9vh] w-full flex-row items-center justify-center bg-dark">
			<span className="flex flex-row items-center justify-around w-2/5 md:w-3/12">

				<Tool
					label='Supprimer'
					onClick={props.onClear}
				>
					<Clear className="h-7 w-7 stroke-white" />
				</Tool>

				<Tool
					label='Retour'
					onClick={props.onRewind}
				>
					<Rewind className="h-6 w-6 stroke-white" />
				</Tool>

				<Tool
					label='Gomme'
					onClick={() => selectedTool === "ERASER" ? selectTool("LINE_DRAWER") : selectTool("ERASER")}
					>
						<Eraser
							className={
								"h-6 w-6 " +
								(selectedTool === "ERASER"
									? "fill-main stroke-main"
									: "fill-white stroke-white")
							}
						/>
				</Tool>
				
				<Tool
					label='Autres voies'
					className='hidden md:block'
					onClick={toggleOtherTracks}
				>
					<ManyTracks
						className={
							"h-6 w-6 " +
							(isOtherTracksDisplayed ? "stroke-main" : "stroke-white")
						}
					/>
				</Tool>
			</span>

			<span className="w-1/5 mx-3 flex self-end pb-4 md:hidden">
				<ToolSelectorMobile
					selectedTool={
						selectedTool !== "ERASER" ? selectedTool : "LINE_DRAWER"
					}
					onToolSelect={selectTool}
				/>
			</span>

			<span className="w-1/2 flex-row items-center justify-around px-[13%] hidden md:flex">
				<Tool
					label='Tracé'
					onClick={() => selectTool("LINE_DRAWER")}
				>
					<Track
						className={
							"h-6 w-6 " +
							(selectedTool === "LINE_DRAWER"
								? getStrokeColorClass(grade)
								: "stroke-white")
						}
					/>
				</Tool>
				
				<Tool
					label='Main de départ'
					className={topoType === TopoTypes.Cliff ? 'hidden' : ''}
					onClick={() => selectTool("HAND_DEPARTURE_DRAWER")}
				>
					<Hand
						className={
							"h-6 w-6 " +
							(selectedTool === "HAND_DEPARTURE_DRAWER"
								? getStrokeColorClass(grade) + " fill-white"
								: "stroke-white")
						}
					/>
				</Tool>

				<Tool
					label='Pied de départ'
					className={topoType === TopoTypes.Cliff ? 'hidden' : ''}
					onClick={() => selectTool("FOOT_DEPARTURE_DRAWER")}
				>
					<ClimbingShoe
						className={
							"h-7 w-7 " +
							(selectedTool === "FOOT_DEPARTURE_DRAWER"
								? getStrokeColorClass(grade) + " fill-white"
								: "stroke-white")
						}
					/>
				</Tool>

				<Tool
					label='Zone interdite'
					className={topoType === TopoTypes.Cliff ? 'hidden' : ''}
					onClick={() => selectTool("FORBIDDEN_AREA_DRAWER")}
				>
					<ForbiddenArea
						className={
							"h-6 w-6 " +
							(selectedTool === "FORBIDDEN_AREA_DRAWER"
								? "fill-white stroke-second"
								: "stroke-white")
						}
					/>
				</Tool>
			</span>

			<span className="flex flex-row w-2/5 items-center justify-around md:hidden">
				<ManyTracks
					className={
						"h-6 w-6 md:cursor-pointer " +
						(isOtherTracksDisplayed ? "stroke-main" : "stroke-white")
					}
					onClick={toggleOtherTracks}
				/>
				<Checked
					className="h-6 w-6 md:cursor-pointer fill-main"
					onClick={closeDrawer}
				/>
			</span>
		</div>
	);
};

Toolbar.displayName = "Toolbar";