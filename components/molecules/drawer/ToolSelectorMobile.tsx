import React, { useState } from "react";
import { DrawerToolEnum, TopoTypes } from "types";

import ForbiddenArea from "assets/icons/forbidden-area.svg";
import ClimbingShoe from "assets/icons/climbing-shoe.svg";
import Hand from "assets/icons/hand.svg";
import Track from "assets/icons/track.svg";
import { useTopoType } from "helpers/hooks/TopoTypeProvider";

interface ToolselectorMobileProps {
	selectedTool: Exclude<DrawerToolEnum, "ERASER">;
	onToolSelect: (tool: DrawerToolEnum) => void;
}

export const ToolSelectorMobile: React.FC<ToolselectorMobileProps> = (
	props: ToolselectorMobileProps
) => {
	const topoType = useTopoType();
	const [open, setOpen] = useState(false);

	const FallbackIcon =
		props.selectedTool === "LINE_DRAWER"
			? Track
			: props.selectedTool === "HAND_DEPARTURE_DRAWER"
			? Hand
			: props.selectedTool === "FOOT_DEPARTURE_DRAWER"
			? ClimbingShoe
			: ForbiddenArea;

	return (
		<button
			className={"z-1000 flex w-[80px] min-h-[80px] md:cursor-pointer flex-col items-center justify-evenly rounded-full bg-dark shadow"}
			onClick={() => setOpen(!open)}
		>
			{open && (
				<div className="flex flex-col gap-10 py-6">
					<ForbiddenArea
						className={
							topoType === TopoTypes.Cliff ? 'hidden' :
							props.selectedTool === "FORBIDDEN_AREA_DRAWER"
								? "order-last h-8 w-8 md:cursor-pointer stroke-main"
								: "h-6 w-6 md:cursor-pointer stroke-white"
						}
						onClick={() => {
							props.onToolSelect("FORBIDDEN_AREA_DRAWER");
							setOpen(false);
						}}
					/>
					<ClimbingShoe
						className={
							topoType === TopoTypes.Cliff ? 'hidden' :
							props.selectedTool === "FOOT_DEPARTURE_DRAWER"
								? "order-last h-8 w-8 md:cursor-pointer stroke-main"
								: "h-7 w-7 md:cursor-pointer stroke-white"
						}
						onClick={() => {
							props.onToolSelect("FOOT_DEPARTURE_DRAWER");
							setOpen(false);
						}}
					/>
					<Hand
						className={
							topoType === TopoTypes.Cliff ? 'hidden' :
							props.selectedTool === "HAND_DEPARTURE_DRAWER"
								? "order-last h-8 w-8 md:cursor-pointer stroke-main"
								: "h-6 w-6 md:cursor-pointer stroke-white"
						}
						onClick={() => {
							props.onToolSelect("HAND_DEPARTURE_DRAWER");
							setOpen(false);
						}}
					/>
					<Track
						className={
							props.selectedTool === "LINE_DRAWER"
								? "order-last h-8 w-8 md:cursor-pointer stroke-main"
								: "h-6 w-6 md:cursor-pointer stroke-white"
						}
						onClick={() => {
							props.onToolSelect("LINE_DRAWER");
							setOpen(false);
						}}
					/>
				</div>
			)}
			{!open && <FallbackIcon className="h-8 w-8 stroke-main" />}
		</button>
	);
};
