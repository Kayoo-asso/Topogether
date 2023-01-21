import { TextInput } from "components/molecules";
import { useBreakpoint, usePosition } from "helpers/hooks";
import { api } from "helpers/services";
import { useCallback, useEffect, useRef, useState } from "react";
import { LightTopo } from "types";
import { findPlace, GeocodingFeature } from "helpers/map/geocodingMapbox";
import { useSelectStore } from "components/pages/selectStore";

let timer: NodeJS.Timeout;
export function useToposSearchbar (): [() => JSX.Element, LightTopo[], GeocodingFeature[]] {
	const [topoApiResults, setTopoApiResults] = useState<LightTopo[]>([]);
	const [mapboxApiResults, setMapboxApiResults] = useState<GeocodingFeature[]>([]);
	
    const SearchInput = useCallback(() => {
		const bp = useBreakpoint();
		const { position } = usePosition();
		const inputRef = useRef<HTMLInputElement>(null);
		const [value, setValue] = useState("");

		const getPredictions = async (val: string) => {
			const topoResults = await api.searchLightTopos(val, 5, 0.2);
			setTopoApiResults(topoResults);
	
			const mapboxResults = await findPlace(val, { 
				types: ["country", "region", "place", 'address', 'poi'],
				proximity: position || undefined 
			});
			setMapboxApiResults(mapboxResults || []);
		};

		const open = useSelectStore(s => s.info) === 'SEARCHBAR';
		useEffect(() => {
			if (inputRef.current) inputRef.current.focus();
		}, [open])

		const handleKeyboardShortcuts = (e: KeyboardEvent) => {
			if (e.code === "Enter" && value.length > 2) {
				// if (topoApiResults.length > 0) selectTopo(topoApiResults[0]);
				// else if (mapboxApiResults.length > 0) selectPlace(mapboxApiResults[0]);
			} else if (e.code === "Escape") setValue("");
		};
		useEffect(() => {	
			if (inputRef.current) inputRef.current.addEventListener("keyup", handleKeyboardShortcuts);
			return () => {
				if (inputRef.current) inputRef.current.removeEventListener("keyup", handleKeyboardShortcuts);
			};
		}, [inputRef.current]);
			
		return (
			<TextInput
				id="searchbar"
				ref={inputRef}
				autoComplete="off"
				label="Rechercher un topo"
				displayLabel={false}
				border={bp === 'mobile'}
				wrapperClassName="w-[95%] mt-0"
				value={value}
				onChange={(e) => {
					const val = e.target.value;
					setValue(val);
					if (val.length > 2) {
						clearTimeout(timer);
						timer = setTimeout(() => {
							getPredictions(val);
						}, 300);
					}
				}}
			/>
		) 
	}, []);

    return [SearchInput, topoApiResults, mapboxApiResults];
}