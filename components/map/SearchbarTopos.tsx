import React, { useState, useEffect, useRef } from "react";
import { TextInput } from "components";
import { api } from "helpers/services";
import { useRouter } from "next/router";
import { findPlace, GeocodingFeature } from "helpers/map/geocodingMapbox";
import { usePosition } from "helpers/hooks";
import { LightTopo } from "types";
import { Map } from "ol";
import Link from "next/link";
import { encodeUUID } from "helpers/utils";

import SearchIcon from "assets/icons/search.svg";
import MarkerIcon from "assets/icons/marker.svg";
import Flag from "assets/icons/flag.svg";
import { fromLonLat } from "ol/proj";

export interface SearchbarToposProps {
	topos: LightTopo[];
	topoIdToRestrict?: number;
	map: Map | null;
	onMapboxResultSelect?: (place: GeocodingFeature) => void;
	// onAddTopoSelect?: () => void,
}

let timer: NodeJS.Timeout;
export const SearchbarTopos: React.FC<SearchbarToposProps> = (props: SearchbarToposProps) => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const { position } = usePosition();

	const [value, setValue] = useState("");
	const [topoApiResults, setTopoApiResults] = useState<LightTopo[]>([]);
	const [mapboxApiResults, setMapboxApiResults] = useState<GeocodingFeature[]>([]);

	const getPredictions = async () => {
		const topoResults = await api.searchLightTopos(value, 5, 0.2);
		setTopoApiResults(topoResults);

		const mapboxResults = await findPlace(value, { 
			types: ["country", "region", "place", 'address', 'poi'],
			proximity: position || undefined 
		});
		setMapboxApiResults(mapboxResults || []);
	};
	useEffect(() => { // throttle
		if (value?.length > 2) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				getPredictions();
			}, 300);
		}
	}, [value]);

	const selectTopo = (topo: LightTopo) => {
		setValue(topo.name);
		router.push("/topo/" + topo.id);
	};
	const selectPlace = (place: GeocodingFeature) => {
		setValue(place.text);
		props.map?.getView().setCenter(fromLonLat(place.center));
	};

	const handleKeyboardShortcuts = (e: KeyboardEvent) => {
		if (e.code === "Enter" && value.length > 2) {
			if (topoApiResults.length > 0) selectTopo(topoApiResults[0]);
			else if (mapboxApiResults.length > 0) selectPlace(mapboxApiResults[0]);
		} else if (e.code === "Escape") setValue("");
	};
	useEffect(() => {
		if (inputRef.current) inputRef.current.addEventListener("keyup", handleKeyboardShortcuts);
		return () => {
			if (inputRef.current) inputRef.current.removeEventListener("keyup", handleKeyboardShortcuts);
		};
	}, [inputRef.current]);

	return (
		<div className='flex flex-col h-full gap-8'>
			<div className='flex flex-row gap-3 items-center'>
				<SearchIcon className="h-7 w-7 stroke-main" />					
				<TextInput
					id="searchbar"
					ref={inputRef}
					autoComplete="off"
					label="Rechercher un lieu ou un topo"
					displayLabel={false}
					wrapperClassName="w-[95%] mt-1"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</div>

			<div className='flex flex-col px-4'>
				{topoApiResults.length > 0 &&
					<>
						<div className='ktext-section-title py-4'>Liste des topos</div>
						{topoApiResults.map((topo) => (
							<Link href={"/topo/" + encodeUUID(topo.id)} key={topo.id}>
								<a className={`ktext-base flex flex-row items-center gap-4 py-3 px-7 text-dark md:cursor-pointer hover:bg-grey-light`}>
									<MarkerIcon className="h-5 w-5 fill-main" />
									<div>{topo.name}</div>
								</a>
							</Link>
						))}
					</>
				}
				{mapboxApiResults.length > 0 &&
					<>
						<div className='ktext-section-title py-4'>Lieux</div>
						{mapboxApiResults.map((res) => (
							<div
								key={res.place_name}
								className={`ktext-base flex flex-row items-center gap-4 py-3 px-7 text-dark md:cursor-pointer hover:bg-grey-light`}
								onClick={() => selectPlace(res)}
							>
								<Flag className="h-5 w-5 stroke-dark" />
								<div>{res.text}</div>
							</div>
						))}
					</>
				}
			</div>

			{/* <MapSearchResults
				topoApiResults={topoApiResults}
				mapboxApiResults={mapboxApiResults}
				boulderResults={boulderResults}
				onPlaceSelect={selectPlace}
				onBoulderSelect={selectBoulder}
				onClose={() => setResultsOpen(false)}
			/> */}
		</div>
	);
};

SearchbarTopos.displayName = 'SearchbarTopos';