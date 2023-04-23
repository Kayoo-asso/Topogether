import Link from "next/link";
import React from "react";
import { encodeUUID } from "helpers/utils";
import type { Boulder, LightTopoOld } from "types";
import { GeocodingFeature } from "helpers/map/geocodingMapbox";

import Rock from "assets/icons/rock.svg";
import Flag from "assets/icons/flag.svg";
import MarkerIcon from "assets/icons/marker.svg";

interface MapSearchResultsProps {
	topoApiResults: LightTopoOld[];
	mapboxApiResults: GeocodingFeature[];
	boulderResults: Boulder[];
	onPlaceSelect: (place: GeocodingFeature) => void;
	onBoulderSelect: (boulder: Boulder) => void;
	onClose: () => void;
}

export const MapSearchResults: React.FC<MapSearchResultsProps> = (
	props: MapSearchResultsProps
) => {
	return (
		<div className="absolute left-0 top-0 z-50 w-[94%] rounded-lg bg-white pb-3 pt-[55px] shadow md:w-[97%]">
			{/* TODO: Add closing button */}
			{/* TODO: Add "Résultats récents" */}

			{props.topoApiResults.length > 0 &&
				props.topoApiResults.map((topo) => (
					<Link href={"/topo/" + encodeUUID(topo.id)} key={topo.id}>
						<a
							className={`ktext-base flex flex-row items-center gap-4 px-7 py-3 text-dark hover:bg-grey-light md:cursor-pointer`}
						>
							<MarkerIcon className="h-5 w-5 fill-main" />
							<div>{topo.name}</div>
						</a>
					</Link>
				))}

			{props.boulderResults.length > 0 &&
				props.boulderResults.map((boulder) => (
					<div
						key={boulder.id}
						className={`ktext-base flex flex-row items-center gap-4 px-7 py-3 text-dark hover:bg-grey-light md:cursor-pointer`}
						onClick={() => props.onBoulderSelect(boulder)}
					>
						<Rock className="h-5 w-5 stroke-main" />
						<div>{boulder.name}</div>
					</div>
				))}

			{props.mapboxApiResults.length > 0 && (
				<>
					<div className="ktext-label mb-2 mt-5 px-7 uppercase text-grey-medium">
						Lieux
					</div>
					{props.mapboxApiResults.map((res) => (
						<div
							key={res.place_name}
							className={`ktext-base flex flex-row items-center gap-4 px-7 py-3 text-dark hover:bg-grey-light md:cursor-pointer`}
							onClick={() => props.onPlaceSelect(res)}
						>
							<Flag className="h-5 w-5 stroke-dark" />
							<div>{res.text}</div>
						</div>
					))}
				</>
			)}
		</div>
	);
};
