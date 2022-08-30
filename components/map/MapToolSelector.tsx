import React from "react";
import { ImageInput } from "components/molecules";
import { useBreakpoint } from "helpers/hooks";
import type { Img } from "types";

import Sector from "assets/icons/sector.svg";
import Rock from "assets/icons/rock.svg";
import Parking from "assets/icons/parking.svg";
import Waypoint from "assets/icons/help-round.svg";
import { useSelectStore } from "components/pages/selectStore";

interface MapToolSelectorProps {
	photoActivated?: boolean;
	onNewPhoto: (img: Img) => void;
	onPhotoButtonClick?: () => void;
}

export const MapToolSelector: React.FC<MapToolSelectorProps> = (
	props: MapToolSelectorProps
) => {
	const breakpoint = useBreakpoint();
	const select = useSelectStore(s => s.select);
	const flush = useSelectStore(s => s.flush);
	const tool = useSelectStore(s => s.tool);

	return (
		<div className="z-20 flex flex-row rounded-full bg-white shadow">
			<div className="flex h-[60px] flex-row items-center gap-5 rounded-full bg-white px-4 md:px-6">
				{breakpoint === "desktop" && (
					<Sector
						className={
							"h-6 w-6 cursor-pointer " +
							(tool === "SECTOR"
								? "fill-main stroke-main"
								: "fill-grey-light stroke-grey-light")
						}
						onClick={() => {
							if (tool === 'SECTOR') flush.tool();
							else select.tool("SECTOR");
						}}
					/>
				)}
				<Rock
					className={
						"h-6 w-6 cursor-pointer " +
						(tool === "ROCK" ? "stroke-main" : "stroke-grey-light")
					}
					onClick={() => {
						if (tool === 'ROCK') flush.tool();
						else select.tool("ROCK");
					}}
				/>
				<Waypoint
					className={
						"h-6 w-6 cursor-pointer " +
						(tool === "WAYPOINT"
							? "fill-third stroke-third"
							: "fill-grey-light stroke-grey-light")
					}
					onClick={() => {
						if (tool === 'WAYPOINT') flush.tool();
						else select.tool("WAYPOINT");
					}}
				/>
				<Parking
					className={
						"h-6 w-6 cursor-pointer " +
						(tool === "PARKING"
							? "fill-second"
							: "fill-grey-light")
					}
					onClick={() => {
						if (tool === 'PARKING') flush.tool();
						else select.tool("PARKING");
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

MapToolSelector.displayName = 'MapToolSelector';