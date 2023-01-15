import React, { useState, useEffect, useRef } from "react";
import Trigram from "trigram-search";
import { Boulder, Topo, UUID } from "types";
import { TrigramOutput } from "trigram-search/build/main/lib/ITrigram";
import { SectorList, TextInput } from "components/molecules";
import { Quark } from "helpers/quarky";
import { Map as OLMap } from "ol";
import { SectorListBuilder } from "components/organisms/builder/SectorListBuilder";
import { useRouter } from "next/router";

import SearchIcon from "assets/icons/search.svg";

export interface SearchbarBouldersProps {
	topo: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	map: OLMap | null;
	onBoulderResultSelect?: (boulder: Boulder) => void;
	// onAddTopoSelect?: () => void,
}

let timer: NodeJS.Timeout;
export const SearchbarBoulders: React.FC<SearchbarBouldersProps> = (props: SearchbarBouldersProps) => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const [value, setValue] = useState("");

	const [boulderResults, setBoulderResults] = useState<Boulder[]>([]);
	const boulderSearcher = new Trigram(props.topo().boulders.toArray(), {
		idField: "id",
		searchField: "name",
		count: 5,
	});

	const getPredictions = async () => {
		const boulderResults: TrigramOutput = boulderSearcher.find(value);
		setBoulderResults(boulderResults.map((res) => res.value as Boulder));
	};
	useEffect(() => { // throttle
		if (value?.length > 2) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				getPredictions();
			}, 300);
		}
	}, [value]);

	const handleKeyboardShortcuts = (e: KeyboardEvent) => {
		if (e.code === "Enter" && value.length > 2) {
			// if (topoApiResults.length > 0) selectTopo(topoApiResults[0]);
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
					label="Rechercher un bloc ou un secteur"
					displayLabel={false}
					inputClassName="border-b-2 border-main"
					wrapperClassName="w-[95%] mt-1"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</div>

			<div className='flex flex-col px-4'>
				<div className='ktext-section-title py-4'>Liste des blocs</div>
				
				{router.pathname.includes('topo') && 
					<SectorList 
						topoQuark={props.topo}
						boulderOrder={props.boulderOrder}
						map={props.map}
					/>
				}
				{router.pathname.includes('builder') && 
					<SectorListBuilder 
						topoQuark={props.topo}
						boulderOrder={props.boulderOrder}
						map={props.map}
					/>
				}
			</div>
		</div>
	);
};

SearchbarBoulders.displayName = 'SearchbarBoulders';