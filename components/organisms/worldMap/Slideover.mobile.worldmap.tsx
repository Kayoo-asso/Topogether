import React from "react";
import { useSelectStore } from "components/store/selectStore";
import { Map } from "ol";
import { SearchbarToposMobile } from "components/map/searchbar/SearchbarTopos.mobile";
import { ToposFiltersMobile } from "components/map/filters/ToposFilters.mobile";
import { TopoFiltersComponents } from "components/map/filters/useToposFilters";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { SlideoverMobile } from "components/atoms/overlays/SlideoverMobile";

type SlideoverMobileWorldmapProps = {
	map: Map | null;
	Filters: TopoFiltersComponents;
	onFilterReset: () => void;
}

export const SlideoverMobileWorldmap: React.FC<SlideoverMobileWorldmapProps> = (props: SlideoverMobileWorldmapProps) => {
    const breakpoint = useBreakpoint();
	const selectedInfo = useSelectStore(s => s.info);
	const flush = useSelectStore(s => s.flush);

    const getContent = () => {
        switch (selectedInfo) {
			case 'SEARCHBAR': return <SearchbarToposMobile map={props.map} />;
			case 'FILTERS': return <ToposFiltersMobile Filters={props.Filters} onResetClick={props.onFilterReset} />;
			default: return undefined;
        }
    }

	const onClose = () => {
		if (breakpoint === 'mobile') flush.all();
		else flush.info()
	}

	return (
		<>
			{breakpoint === "mobile" && (
				<SlideoverMobile 
					open={selectedInfo === 'SEARCHBAR' || selectedInfo === 'FILTERS'}
					height={selectedInfo === 'FILTERS' ? 50 : undefined}
					onClose={onClose}
				>
					<div className="h-full pl-6 pr-3 pt-12">
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
		</>
	);
};

SlideoverMobileWorldmap.displayName = "SlideoverMobileWorldmap"