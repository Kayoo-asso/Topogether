import React from "react";
import { useSelectStore } from "components/store/selectStore";

import FilterIcon from "assets/icons/filter.svg";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { RoundButton } from "components/atoms/buttons/RoundButton";

export const FilterButton: React.FC = () => {
	const bp = useBreakpoint();
	const select = useSelectStore(s => s.select);
	const open = useSelectStore(s => s.info) === 'FILTERS';

	return (
		<>
			<div className={open && bp !== 'mobile' ? 'hidden' : ''}>
				<RoundButton
					className={"z-20"}
					onClick={() => select.info('FILTERS', bp)}
				>
					<FilterIcon
						className={`h-6 w-6 stroke-main fill-main`}
					/>
				</RoundButton>
			</div>
		</>
	);
};

FilterButton.displayName = 'FilterButton';