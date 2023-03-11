import React from "react";
import { Map } from "ol";
import { SearchbarToposResults } from "./SearchbarToposResults";
import { useToposSearchbar } from "./useToposSearchbar";
import { useSelectStore } from "components/store/selectStore";

export interface SearchbarToposDesktopProps {
	map: Map | null;
	onlyPlaces?: boolean;
}

export const SearchbarToposDesktop: React.FC<SearchbarToposDesktopProps> = ({
	onlyPlaces = false,
	...props
}: SearchbarToposDesktopProps) => {
	const [SearchInput, toposResults, mapboxResults] = useToposSearchbar(onlyPlaces);
	const open = useSelectStore(s => s.info) === 'SEARCHBAR';

	return (
		<div className={open ? '' : 'hidden'}>
			<div className="absolute top-0 z-100 h-[60px] rounded-full bg-white pl-[80px] shadow w-[97%]">
				<SearchInput />
			</div>

			<div className={`px-10 absolute left-0 top-0 z-50 rounded-lg bg-white pt-[60px] pb-3 shadow w-[97%] ${mapboxResults.length > 0 || toposResults.length > 0 ? '' : 'hidden'}`}>
				<SearchbarToposResults 
					mapboxApiResults={mapboxResults}
					topoApiResults={toposResults}
					map={props.map}
				/>
			</div>
		</div>
	);
};

SearchbarToposDesktop.displayName = 'SearchbarToposDesktop';