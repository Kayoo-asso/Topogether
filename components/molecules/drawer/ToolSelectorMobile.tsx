import React, { useState } from "react";
import { DrawerToolEnum } from "types";
import ForbiddenArea from "assets/icons/forbidden-area.svg";
import ClimbingShoe from "assets/icons/climbing-shoe.svg";
import Hand from "assets/icons/hand.svg";
import TopoIcon from "assets/icons/topo.svg";

interface ToolselectorMobileProps {
	selectedTool: Exclude<DrawerToolEnum, "ERASER">;
	onToolSelect: (tool: DrawerToolEnum) => void;
}

export const ToolSelectorMobile: React.FC<ToolselectorMobileProps> = (
	props: ToolselectorMobileProps
) => {
	const [open, setOpen] = useState(false);

	const FallbackIcon =
		props.selectedTool === "LINE_DRAWER"
			? TopoIcon
			: props.selectedTool === "HAND_DEPARTURE_DRAWER"
			? Hand
			: props.selectedTool === "FOOT_DEPARTURE_DRAWER"
			? ClimbingShoe
			: ForbiddenArea;

	return (
		<button
			className={
				"z-1000 flex w-[80px] cursor-pointer flex-col items-center justify-evenly rounded-full bg-dark shadow " +
				(open ? "h-[280px]" : "h-[80px]")
			}
			onClick={() => setOpen(!open)}
		>
			{open && (
				<>
					<ForbiddenArea
						className={
							props.selectedTool === "FORBIDDEN_AREA_DRAWER"
								? "order-last h-8 w-8 cursor-pointer stroke-main"
								: "h-6 w-6 cursor-pointer stroke-white"
						}
						onClick={() => {
							props.onToolSelect("FORBIDDEN_AREA_DRAWER");
							setOpen(false);
						}}
					/>
					<ClimbingShoe
						className={
							props.selectedTool === "FOOT_DEPARTURE_DRAWER"
								? "order-last h-8 w-8 cursor-pointer stroke-main"
								: "h-7 w-7 cursor-pointer stroke-white"
						}
						onClick={() => {
							props.onToolSelect("FOOT_DEPARTURE_DRAWER");
							setOpen(false);
						}}
					/>
					<Hand
						className={
							props.selectedTool === "HAND_DEPARTURE_DRAWER"
								? "order-last h-8 w-8 cursor-pointer stroke-main"
								: "h-6 w-6 cursor-pointer stroke-white"
						}
						onClick={() => {
							props.onToolSelect("HAND_DEPARTURE_DRAWER");
							setOpen(false);
						}}
					/>
					<TopoIcon
						className={
							props.selectedTool === "LINE_DRAWER"
								? "order-last h-8 w-8 cursor-pointer stroke-main"
								: "h-6 w-6 cursor-pointer stroke-white"
						}
						onClick={() => {
							props.onToolSelect("LINE_DRAWER");
							setOpen(false);
						}}
					/>
				</>
			)}
			{!open && <FallbackIcon className="h-8 w-8 stroke-main" />}
		</button>
	);
};
