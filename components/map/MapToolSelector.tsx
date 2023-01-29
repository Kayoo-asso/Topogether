import React, { useCallback } from "react";
import { useSelectStore } from "components/pages/selectStore";
import { MapToolEnum } from "types";

import Add from "assets/icons/add.svg";
import Rock from "assets/icons/rock.svg";
import InfoLight from "assets/icons/infoLight.svg";
import ParkingLight from "assets/icons/parkingLight.svg";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { RoundButton } from "components/atoms/buttons/RoundButton";


interface MapToolSelectorProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const MapToolSelector: React.FC<MapToolSelectorProps> = (props: MapToolSelectorProps) => {
	const bp = useBreakpoint();
	const select = useSelectStore(s => s.select);
	const flush = useSelectStore(s => s.flush);
	const tool = useSelectStore(s => s.tool);

	const onToolClick = useCallback((t: MapToolEnum) => {
		flush.item();
		if (tool === t) flush.tool();
		else select.tool(t);
	}, [tool]);

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
				<div className={"z-20 flex flex-col justify-center items-center gap-2 px-2 rounded-full bg-white shadow h-[80px]" + ((bp === 'mobile') ? ' w-[96%]' : '')}>
					<div 
						className="ktext-label text-xxs text-black text-center"
						onClick={() => { 
							if (bp === 'mobile') {
								flush.tool();
								props.setOpen(false);
							}
						}}
					>Ajouter au topo</div>
					

					<div className="flex flex-row items-center gap-3 rounded-full bg-white px-4 md:px-6">
						<div 
							className={`ktext-label text-xs p-3 rounded-sm md:cursor-pointer ${tool === "SECTOR" ? 'text-main bg-main bg-opacity-30' : 'text-grey-light'}`}
							onClick={() => onToolClick('SECTOR')}
						>Nouveau secteur</div>

						<div className="text-grey-light"> | </div>

						<div 
							className={`p-2 rounded-sm md:cursor-pointer ${tool === "ROCK" ? "bg-main bg-opacity-30" : ""}`}
							onClick={() => onToolClick('ROCK')}
						>
							<Rock
								className={`h-6 w-6 md:cursor-pointer	${tool === "ROCK" ? "stroke-main" : "stroke-grey-light"}`}	
							/>
						</div>

						<div 
							className={`p-2 rounded-sm md:cursor-pointer ${tool === "WAYPOINT" ? " bg-info-light" : ""}`}
							onClick={() => onToolClick('WAYPOINT')}
						>
							<InfoLight
								className={`h-5 w-5 stroke-[1.2px] md:cursor-pointer ${tool === "WAYPOINT" ? "stroke-info fill-info" : "stroke-grey-light fill-grey-light"}`}
							/>
						</div>

						<div 
							className={`p-2 rounded-sm md:cursor-pointer ${tool === "PARKING" ? " bg-info-light" : ""}`}
							onClick={() => onToolClick('PARKING')}
						>
							<ParkingLight
								className={`h-5 w-5 md:cursor-pointer ${tool === "PARKING" ? "fill-info" : "fill-grey-light"}`}
							/>
						</div>
					
						{/* {bp === "mobile" && <div className="text-grey-light"> | </div>}
						{bp === "mobile" &&	
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