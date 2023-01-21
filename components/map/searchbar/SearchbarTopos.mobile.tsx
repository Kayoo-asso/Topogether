import React from "react";
import { Map } from "ol";
import { SearchbarToposResults } from "./SearchbarToposResults";
import { useToposSearchbar } from "./useToposSearchbar";

import SearchIcon from "assets/icons/search.svg";

export interface SearchbarToposMobileProps {
	map: Map | null;
}

export const SearchbarToposMobile: React.FC<SearchbarToposMobileProps> = (props: SearchbarToposMobileProps) => {
	const [SearchInput, toposResults, mapboxResults] = useToposSearchbar();

	return (
		<div className='flex flex-col h-full gap-8'>
			<div className='flex flex-row gap-3 items-center'>
				<SearchIcon className="h-7 w-7 stroke-main" />					
				<SearchInput />
			</div>

			<SearchbarToposResults 
				mapboxApiResults={mapboxResults}
				topoApiResults={toposResults}
				map={props.map}
			/>
		</div>
	);
};

SearchbarToposMobile.displayName = 'SearchbarToposMobile';