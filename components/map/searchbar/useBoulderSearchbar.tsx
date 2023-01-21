import { TextInput } from "components/molecules";
import { useSelectStore } from "components/pages/selectStore";
import { useBreakpoint } from "helpers/hooks";
import { Quark } from "helpers/quarky";
import { useCallback, useEffect, useRef, useState } from "react";
import Trigram from "trigram-search";
import { TrigramOutput } from "trigram-search/build/main/lib/ITrigram";
import { Boulder, Topo } from "types";

let timer: NodeJS.Timeout;
export function useBoulderSearchbar (topo: Quark<Topo>): [() => JSX.Element, Boulder[]] {
	const [boulderResults, setBoulderResults] = useState<Boulder[]>([]);
	
    const SearchInput = useCallback(() => {
		const bp = useBreakpoint();
		const inputRef = useRef<HTMLInputElement>(null);
		const [value, setValue] = useState("");

		const boulderSearcher = new Trigram(topo().boulders.toArray(), {
			idField: "id",
			searchField: "name",
			count: 5,
		});

		const getPredictions = async (val: string) => {
			const boulderResults: TrigramOutput = boulderSearcher.find(val);
			setBoulderResults(boulderResults.map((res) => res.value as Boulder));
		};

		const open = useSelectStore(s => s.info) === 'SEARCHBAR';
		useEffect(() => {
			if (inputRef.current) inputRef.current.focus();
		}, [open])

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
			<TextInput
				id="searchbar"
				ref={inputRef}
				autoComplete="off"
				label="Rechercher un bloc"
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

    return [SearchInput, boulderResults];
}