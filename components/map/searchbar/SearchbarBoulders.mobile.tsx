import React from "react";
import { Boulder, Topo, UUID } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { Map as OLMap } from "ol";
import { SearchbarBouldersResults } from "./SearchbarBouldersResults";
import { useBoulderSearchbar } from "./useBoulderSearchbar";

import SearchIcon from "assets/icons/search.svg";

export interface SearchbarBouldersMobileProps {
	topo: Quark<Topo>;
	map: OLMap | null;
	onBoulderResultSelect?: (boulder: Boulder) => void;
}

export const SearchbarBouldersMobile: React.FC<SearchbarBouldersMobileProps> = watchDependencies((props: SearchbarBouldersMobileProps) => {
	const [SearchInput, boulderResults] = useBoulderSearchbar(props.topo);
	return (
		<div className='flex flex-col h-full gap-8 md:hidden'>
			<div className='flex flex-row gap-3 items-center'>
				<SearchIcon className="h-7 w-7 stroke-main" />
				<SearchInput />
			</div>

			<SearchbarBouldersResults 
				topo={props.topo}
				boulderResults={boulderResults}
				map={props.map}
			/>
		</div>
	);
});

SearchbarBouldersMobile.displayName = 'SearchbarBouldersMobile';