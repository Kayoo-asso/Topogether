import React from "react";
import { useBreakpoint } from "helpers/hooks";
import { useSelectStore } from "components/pages/selectStore";

import Add from "assets/icons/add.svg";
import Sector from "assets/icons/sector.svg";
import Rock from "assets/icons/rock.svg";
import Parking from "assets/icons/parking.svg";
import Waypoint from "assets/icons/help-round.svg";
import { RoundButton } from "components/atoms";

interface MapToolSelectorProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const MapToolSelector: React.FC<MapToolSelectorProps> = (props: MapToolSelectorProps) => {
	const breakpoint = useBreakpoint();
	const select = useSelectStore(s => s.select);
	const flush = useSelectStore(s => s.flush);
	const tool = useSelectStore(s => s.tool);

	return (
		<>
			{!props.open &&
				<RoundButton 
					white
					onClick={() => props.setOpen(true)}
				>
					<Add className="h-6 w-6 stroke-main" />
				</RoundButton>
			}

			{props.open &&
				<div className={"z-20 flex flex-col justify-center items-center gap-2 px-2 rounded-full bg-white shadow h-[80px]" + ((breakpoint === 'mobile') ? ' w-[96%]' : '')}>
					<div 
						className="ktext-label text-xxs text-black text-center"
						onClick={() => { 
							if (breakpoint === 'mobile') {
								flush.tool();
								props.setOpen(false);
							}
						}}
					>Ajouter au topo</div>
					
					<div className="flex flex-row items-center gap-3 rounded-full bg-white px-4 md:px-6">
						{/* <Sector
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
						/> */}
						<div 
							className={"ktext-label text-xs cursor-pointer p-3 rounded-sm " + (tool === "SECTOR" ? 'text-main bg-main bg-opacity-30' : 'text-grey-light')}
							onClick={() => {
								if (tool === 'SECTOR') flush.tool();
								else select.tool("SECTOR");
							}}
						>Nouveau secteur</div>

						<div className="text-grey-light"> | </div>

						<div 
							className={"cursor-pointer p-2 rounded-sm" + (tool === "ROCK" ? " bg-main bg-opacity-30" : "")}
							onClick={() => {
								if (tool === 'ROCK') flush.tool();
								else select.tool("ROCK");
							}}
						>
							<Rock
								className={
									"h-6 w-6 cursor-pointer " +
									(tool === "ROCK" ? "stroke-main" : "stroke-grey-light")
								}	
							/>
						</div>

						<div 
							className={"cursor-pointer p-2 rounded-sm" + (tool === "WAYPOINT" ? " bg-third bg-opacity-30" : "")}
							onClick={() => {
								if (tool === 'WAYPOINT') flush.tool();
								else select.tool("WAYPOINT");
							}}
						>
							<Waypoint
								className={
									"h-6 w-6 cursor-pointer " +
									(tool === "WAYPOINT" ? "fill-third stroke-third" : "fill-grey-light stroke-grey-light")
								}
							/>
						</div>

						<div 
							className={"cursor-pointer p-2 rounded-sm" + (tool === "PARKING" ? " bg-second bg-opacity-30" : "")}
							onClick={() => {
								if (tool === 'PARKING') flush.tool();
								else select.tool("PARKING");
							}}
						>
							<Parking
								className={
									"h-6 w-6 cursor-pointer " +
									(tool === "PARKING" ? "fill-second" : "fill-grey-light")
								}
							/>
						</div>
					
						{/* {breakpoint === "mobile" && <div className="text-grey-light"> | </div>}
						{breakpoint === "mobile" &&	
							<ImageInput
								button="builder"
								size="big"
								multiple={false}
								activated={
									props.photoActivated || process.env.NODE_ENV === "development"
								}
								onChange={(files) => props.onNewPhoto(files[0])}
							/>
						} */}
					</div>	
				</div>
			}
		</>
	);
};

MapToolSelector.displayName = 'MapToolSelector';