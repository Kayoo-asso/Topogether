import React from "react";
import { Boulder, Topo, UUID } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { Map as OLMap } from "ol";
import { SearchbarBouldersResults } from "./SearchbarBouldersResults";
import { useBoulderSearchbar } from "./useBoulderSearchbar";
import { useSelectStore } from "components/store/selectStore";

export interface SearchbarBouldersDesktopProps {
	topo: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	map: OLMap | null;
	onBoulderResultSelect?: (boulder: Boulder) => void;
	// onAddTopoSelect?: () => void,
}

export const SearchbarBouldersDesktop: React.FC<SearchbarBouldersDesktopProps> = watchDependencies((props: SearchbarBouldersDesktopProps) => {
	const [SearchInput, boulderResults] = useBoulderSearchbar(props.topo);
	const open = useSelectStore(s => s.info) === 'SEARCHBAR';

	return (
		<div className={open ? '' : 'hidden'}>
			<div className="absolute top-0 z-100 h-[60px] rounded-full bg-white pl-[80px] shadow w-[97%]">
				<SearchInput />
			</div>

			<div className={`px-10 absolute left-0 top-0 z-50 rounded-lg bg-white pt-[60px] pb-3 shadow w-[97%] ${boulderResults.length > 0 ? '' : 'hidden'}`}>
				<SearchbarBouldersResults 
					topo={props.topo}
					boulderOrder={props.boulderOrder}
					boulderResults={boulderResults}
					map={props.map}
				/>
			</div>
		</div>
	);
});

SearchbarBouldersDesktop.displayName = 'SearchbarBouldersDesktop';