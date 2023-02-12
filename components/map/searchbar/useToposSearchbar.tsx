import { api } from "helpers/services";
import { useCallback, useEffect, useRef, useState } from "react";
import { LightTopo } from "types";
import { findPlace, GeocodingFeature } from "helpers/map/geocodingMapbox";
import { useSelectStore } from "components/pages/selectStore";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { usePosition } from "helpers/hooks/UserPositionProvider";
import { TextInput } from "components/molecules/form/TextInput";

export function useToposSearchbar (onlyPlaces: boolean = false): [() => JSX.Element, LightTopo[], GeocodingFeature[]] {
	const [topoApiResults, setTopoApiResults] = useState<LightTopo[]>([]);
	const [mapboxApiResults, setMapboxApiResults] = useState<GeocodingFeature[]>([]);
	
    const SearchInput = useCallback(() => {
		const bp = useBreakpoint();
		const { position } = usePosition();
		// setTimeout returns a number in the browser, but TypeScript is annoying
		const timer = useRef<ReturnType<typeof setTimeout>>();
		const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
		const [value, setValue] = useState("");

		const getPredictions = async (val: string) => {
			if (!onlyPlaces) {
				const topoResults = await api.searchLightTopos(val, 5, 0.2);
				setTopoApiResults(topoResults);
			}
	
			const mapboxResults = await findPlace(val, { 
				types: ["country", "region", "place", 'address', 'poi'],
				proximity: position || undefined 
			});
			setMapboxApiResults(mapboxResults || []);
		};

		const open = useSelectStore(s => s.info) === 'SEARCHBAR';
		useEffect(() => {
			if (inputRef) inputRef.focus();
		}, [open])

		const handleKeyboardShortcuts = (e: KeyboardEvent) => {
			if (e.code === "Enter" && value.length > 2) {
				// if (topoApiResults.length > 0) selectTopo(topoApiResults[0]);
				// else if (mapboxApiResults.length > 0) selectPlace(mapboxApiResults[0]);
			} else if (e.code === "Escape") setValue("");
		};
		useEffect(() => {	
			if (inputRef) inputRef.addEventListener("keyup", handleKeyboardShortcuts);
			return () => {
				if (inputRef) inputRef.removeEventListener("keyup", handleKeyboardShortcuts);
			};
		}, [inputRef]);
			
		return (
			<TextInput
				id="searchbar"
				ref={setInputRef}
				autoComplete="off"
				label={"Rechercher un lieu" + (!onlyPlaces && " ou un topo")}
				displayLabel={false}
				border={bp === 'mobile'}
				wrapperClassName="w-[95%] mt-0"
				value={value}
				onChange={(e) => {
					const val = e.target.value;
					setValue(val);
					if (val.length > 2) {
						if (timer.current) clearTimeout(timer.current);
						timer.current = setTimeout(() => {
							getPredictions(val);
						}, 300);
					}
				}}
			/>
		) 
	}, []);

    return [SearchInput, topoApiResults, mapboxApiResults];
}