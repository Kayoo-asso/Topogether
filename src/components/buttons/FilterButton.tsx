import FilterIcon from "assets/icons/filter.svg";
import { RoundButton } from "components/atoms/buttons/RoundButton";
import React from "react";
import { useSelectStore } from "~/stores/selectStore";

export const FilterButton: React.FC = () => {
	const select = useSelectStore((s) => s.select);
	const open = useSelectStore((s) => s.info) === "FILTERS";

	return (
		<>
				<RoundButton
					className={"z-20"}
					onClick={() => select.info("FILTERS")}
				>
					<FilterIcon className={`h-6 w-6 fill-main stroke-main`} />
				</RoundButton>
		</>
	);
};

FilterButton.displayName = "FilterButton";
