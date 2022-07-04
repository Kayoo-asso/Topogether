import React from "react";
import { ImageInput } from "components/molecules";
import { useBreakpoint } from "helpers/hooks";

import type { Image, MapToolEnum } from "types";

import Sector from "assets/icons/sector.svg";
import Rock from "assets/icons/rock.svg";
import Parking from "assets/icons/parking.svg";
import Waypoint from "assets/icons/help-round.svg";

interface ItemSelectorMobileProps {
	currentTool?: MapToolEnum;
	photoActivated?: boolean;
	onToolSelect: (tool: MapToolEnum) => void;
	onNewPhoto: (img: Image) => void;
	onPhotoButtonClick?: () => void;
}

export const ItemSelectorMobile: React.FC<ItemSelectorMobileProps> = (
	props: ItemSelectorMobileProps
) => {
	const breakpoint = useBreakpoint();

	return (
		<div className="z-20 flex flex-row rounded-full bg-white shadow">
			<div className="flex h-[60px] flex-row items-center gap-5 rounded-full bg-white px-4 md:px-6">
				{breakpoint === "desktop" && (
					<Sector
						className={
							"h-6 w-6 cursor-pointer " +
							(props.currentTool === "SECTOR"
								? "fill-main stroke-main"
								: "fill-grey-light stroke-grey-light")
						}
						onClick={() => {
							props.onToolSelect("SECTOR");
						}}
					/>
				)}
				<Rock
					className={
						"h-6 w-6 cursor-pointer " +
						(props.currentTool === "ROCK" ? "stroke-main" : "stroke-grey-light")
					}
					onClick={() => {
						props.onToolSelect("ROCK");
					}}
				/>
				<Waypoint
					className={
						"h-6 w-6 cursor-pointer " +
						(props.currentTool === "WAYPOINT"
							? "fill-third stroke-third"
							: "fill-grey-light stroke-grey-light")
					}
					onClick={() => {
						props.onToolSelect("WAYPOINT");
					}}
				/>
				<Parking
					className={
						"h-6 w-6 cursor-pointer " +
						(props.currentTool === "PARKING"
							? "fill-second"
							: "fill-grey-light")
					}
					onClick={() => {
						props.onToolSelect("PARKING");
					}}
				/>
			</div>

			{breakpoint === "mobile" && (
				<ImageInput
					button="builder"
					size="big"
					multiple={false}
					activated={
						props.photoActivated || process.env.NODE_ENV === "development"
					}
					onChange={(files) => props.onNewPhoto(files[0])}
				/>
			)}
		</div>
	);
};
