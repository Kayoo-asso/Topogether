import React from "react";
import { RoundButton } from "components";
import { useBreakpoint } from "helpers/hooks";
import { useSelectStore } from "components/pages/selectStore";

import SearchIcon from "assets/icons/search.svg";

export const SearchButton: React.FC = () => {
	const bp = useBreakpoint();
	const select = useSelectStore(s => s.select);

	return (
		<div className="relative">
			<RoundButton
				className="z-200"
				white
				onClick={() => select.info('SEARCHBAR', bp)}
			>
				<SearchIcon
					className={"h-6 w-6 stroke-main"}
				/>
			</RoundButton>
		</div>
	);
};

SearchButton.displayName = 'SearchButton';