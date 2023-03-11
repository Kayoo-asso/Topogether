import React from "react";
import { useSelectStore } from "components/store/selectStore";
import { RoundButton } from "components/atoms/buttons/RoundButton";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";

import SearchIcon from "assets/icons/search.svg";

export const SearchButton: React.FC = () => {
	const bp = useBreakpoint();
	const select = useSelectStore(s => s.select);
	const flush = useSelectStore(s => s.flush);
	const isOpened = useSelectStore(s => s.info) === 'SEARCHBAR';

	return (
		<div className="relative">
			<RoundButton
				className="z-200"
				white={!isOpened}
				onClick={() => isOpened ? flush.info() : select.info('SEARCHBAR', bp)}
			>
				<SearchIcon
					className={`h-6 w-6 ${isOpened ? 'stroke-white' : 'stroke-main'}`}
				/>
			</RoundButton>
		</div>
	);
};

SearchButton.displayName = 'SearchButton';