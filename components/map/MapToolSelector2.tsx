import React, { useCallback } from "react";
import { useSelectStore } from "components/store/selectStore";
import { Img, MapToolEnum } from "types";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { ImageInput } from "components/molecules/form/ImageInput";

import Rewind from "assets/icons/rewind.svg";
import RockLight from "assets/icons/rockLight.svg";
import InfoLight from "assets/icons/infoLight.svg";
import ParkingLight from "assets/icons/parkingLight.svg";
import { useTutoStore } from "components/store/tutoStore";


interface MapToolSelectorProps {
	onPhoto: (files: Img[]) => void,
}

export const MapToolSelector: React.FC<MapToolSelectorProps> = (props: MapToolSelectorProps) => {
	const bp = useBreakpoint();
	const select = useSelectStore(s => s.select);
	const flush = useSelectStore(s => s.flush);
	const tool = useSelectStore(s => s.tool);
	const showTuto = useTutoStore(t => t.showTuto)

	const onToolClick = useCallback((t: MapToolEnum) => {
		flush.item();
		if (tool === t) flush.tool();
		else select.tool(t);
	}, [tool]);

	return (
		<div className={"z-500 flex flex-row justify-center items-center rounded bg-white shadow h-[70px]" + ((bp === 'mobile') ? ' w-[96%]' : '')}>
			
			<div 
				className='w-1/6 h-full flex justify-center items-center border-r border-grey-light md:cursor-pointer'
				// onClick={() => onToolClick('ROCK')}
			>
				<Rewind
					className={`h-7 w-7 md:cursor-pointer stroke-dark stroke-2`}	
				/>
			</div>

			<div className='w-5/6 h-full'>

				<div className='h-full w-full overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center'>
					<div className='px-5 md:cursor-pointer'>
						<ImageInput
							button="builder"
							size="little"
							multiple={false}
							onChange={props.onPhoto}
						/>
					</div>

					<div className="text-dark"> | </div>

					<div className='px-5'>
						<div className="ktext-label-little mb-1 text-center">Placer sur le topo</div>
						<div className="flex flex-row gap-1.5">
							<div 
								className={`p-1.5 rounded-sm md:cursor-pointer bg-opacity-30 ${tool === "ROCK" ? "bg-main-light" : "bg-grey-light"}`}
								onClick={() => onToolClick('ROCK')}
							>
								<RockLight
									className={`h-6 w-6 stroke-[1.4px] md:cursor-pointer	${tool === "ROCK" ? "stroke-main" : "stroke-dark"}`}	
								/>
							</div>

							<div 
								className={`p-1.5 rounded-sm md:cursor-pointer ${tool === "WAYPOINT" ? "bg-info-light" : "bg-opacity-30 bg-grey-light"}`}
								onClick={() => onToolClick('WAYPOINT')}
							>
								<InfoLight
									className={`h-5 w-5 stroke-[1.4px] md:cursor-pointer ${tool === "WAYPOINT" ? "stroke-info fill-info" : "stroke-dark fill-dark"}`}
								/>
							</div>

							<div 
								className={`p-1.5 rounded-sm md:cursor-pointer ${tool === "PARKING" ? " bg-info-light" : "bg-opacity-30 bg-grey-light"}`}
								onClick={() => onToolClick('PARKING')}
							>
								<ParkingLight
									className={`h-5 w-5 md:cursor-pointer ${tool === "PARKING" ? "fill-info" : "fill-dark"}`}
								/>
							</div>
						</div>
					</div>

					<div className="text-grey-light"> | </div>

					<div className='px-5'>
						<div className='ktext-label-little mb-1 text-center'>Créer un</div>
						<div 
							className={`ktext-label text-xs font-bold p-2 rounded-sm md:cursor-pointer bg-opacity-30 ${tool === "SECTOR" ? 'text-main bg-main-light' : 'text-dark bg-grey-light'}`}
							onClick={() => onToolClick('SECTOR')}
						>Nouveau secteur</div>
					</div>

					<div className="text-grey-light"> | </div>

					<div className='px-5'>
						<div className='ktext-label-little mb-1 text-center'>Aider</div>
						<div 
							className={`ktext-label text-xs font-bold p-2 rounded-sm md:cursor-pointer text-dark bg-opacity-30 bg-grey-light `}
							onClick={() => showTuto('SECTOR_CREATION')}
						>Revoir tuto</div>
					</div>
				</div>

			</div>
		</div>
	);
};

MapToolSelector.displayName = 'MapToolSelector';