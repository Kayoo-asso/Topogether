import React, { useState, useEffect, useRef } from "react";
import Trigram from "trigram-search";
import { RoundButton, TextInput } from "components";
import { api } from "helpers/services";
import { useRouter } from "next/router";
import { Boulder, LightTopo } from "types";
import { TrigramOutput } from "trigram-search/build/main/lib/ITrigram";
import SearchIcon from "assets/icons/search.svg";
import { MapSearchResults } from "./MapSearchResults";
import { findPlace, GeocodingFeature } from "helpers/map/geocodingMapbox";
import { usePosition } from "helpers/hooks";

export interface MapSearchbarProps {
	initialOpen?: boolean;
	placeholder?: string;
	focusOnOpen?: boolean;
	findTopos?: boolean;
	boulders?: Boulder[];
	findBoulders?: boolean;
	findPlaces?: boolean;
	topoIdToRestrict?: number;
	onButtonClick?: (barOpen: boolean) => void;
	onOpenResults?: () => void;
	onMapboxResultSelect?: (place: GeocodingFeature) => void;
	onBoulderResultSelect?: (boulder: Boulder) => void;
	// onAddTopoSelect?: () => void,
}

let timer: NodeJS.Timeout;
export const MapSearchbar: React.FC<MapSearchbarProps> = ({
	initialOpen = false,
	placeholder = "Votre recherche",
	focusOnOpen = true,
	findTopos = false,
	findBoulders = false,
	findPlaces = false,
	...props
}: MapSearchbarProps) => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const { position } = usePosition();

	const [barOpen, setBarOpen] = useState(initialOpen);
	const [resultsOpen, setResultsOpen] = useState(false);
	const [value, setValue] = useState("");
	const [topoApiResults, setTopoApiResults] = useState<LightTopo[]>([]);
	const [mapboxApiResults, setMapboxApiResults] = useState<GeocodingFeature[]>([]);
	const [boulderResults, setBoulderResults] = useState<Boulder[]>([]);
	const boulderSearcher = new Trigram(props.boulders, {
		idField: "id",
		searchField: "name",
		count: 5,
	});

	const getPredictions = async () => {
		if (findTopos) {
			const topoResults = await api.searchLightTopos(value, 5, 0.2);
			setTopoApiResults(topoResults);
		}
		if (findBoulders) {
			const boulderResults: TrigramOutput = boulderSearcher.find(value);
			setBoulderResults(boulderResults.map((res) => res.value as Boulder));
		}
		if (findPlaces) {
			const mapboxResults = await findPlace(value, { 
				types: ["country", "region", "place", 'address', 'poi'],
				proximity: position || undefined 
			});
			setMapboxApiResults(mapboxResults || []);
		}
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
		setResultsOpen(false);
		setValue(topo.name);
		router.push("/topo/" + topo.id);
	};
	const selectPlace = (place: GeocodingFeature) => {
		setResultsOpen(false);
		setValue(place.text);
		props.onMapboxResultSelect && props.onMapboxResultSelect(place);
	};
	const selectBoulder = (boulder: Boulder) => {
		setResultsOpen(false);
		setValue(boulder.name);
		props.onBoulderResultSelect && props.onBoulderResultSelect(boulder);
	};

	useEffect(() => {
		if (resultsOpen && props.onOpenResults) props.onOpenResults();
	}, [resultsOpen]);

	useEffect(() => {
		if (barOpen && focusOnOpen && inputRef.current) inputRef.current.focus();
	}, [barOpen]);

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
		<>
			<div className="relative">
				<RoundButton
					className="z-200"
					white={!barOpen}
					onClick={() => {
						if (props.onButtonClick) props.onButtonClick(barOpen);
						setBarOpen(!barOpen);
					}}
				>
					<SearchIcon
						className={"h-6 w-6 " + (barOpen ? "stroke-white" : "stroke-main")}
					/>
				</RoundButton>

				{barOpen && (
					<div className="absolute top-0 z-100 h-[60px] w-[94%] rounded-full bg-white pl-[80px] shadow md:w-[97%]">
						<TextInput
							id="searchbar"
							ref={inputRef}
							autoComplete="off"
							label="Recherche..."
							displayLabel={false}
							inputClassName="border-none"
							wrapperClassName="w-[95%] mt-1"
							value={value}
							onChange={(e) => {
								setValue(e.target.value);
								if (e.target.value?.length > 2) setResultsOpen(true);
								else setResultsOpen(false);
							}}
							onClick={(e) => {
								if (e.currentTarget.value?.length > 2) setResultsOpen(true);
								else setResultsOpen(false);
							}}
						/>
					</div>
				)}
			</div>

			{barOpen && resultsOpen && (
				<MapSearchResults
					topoApiResults={topoApiResults}
					mapboxApiResults={mapboxApiResults}
					boulderResults={boulderResults}
					onPlaceSelect={selectPlace}
					onBoulderSelect={selectBoulder}
					onClose={() => setResultsOpen(false)}
				/>
			)}
		</>
	);
};
