import React from "react";
import { Quark } from "helpers/quarky";
import { Topo, UUID } from "types";
import { useSelectStore } from "components/store/selectStore";
import { ContributorsList } from "./ContributorsList";
import { Map } from "ol";
import { SearchbarBouldersMobile } from "components/map/searchbar/SearchbarBoulders.mobile";
import { BouldersFiltersComponents } from "components/map/filters/useBouldersFilters";
import { BouldersFiltersMobile } from "components/map/filters/BouldersFilters.mobile";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { InfoForm } from "../form/InfoForm";
import { AccessForm } from "../form/AccessForm";
import { ManagementForm } from "../form/ManagementForm";
import { SlideoverMobile } from "components/atoms/overlays/SlideoverMobile";
import { SlideoverLeftDesktop } from "components/atoms/overlays/SlideoverLeftDesktop";

type SlideoverLeftBuilderProps = {
    topo: Quark<Topo>;
	boulderOrder: globalThis.Map<UUID, number>;
	map: Map | null;
	Filters: BouldersFiltersComponents;
	onFilterReset: () => void;
}

export const SlideoverLeftBuilder: React.FC<SlideoverLeftBuilderProps> = (props: SlideoverLeftBuilderProps) => {
    const bp = useBreakpoint();
	const selectedType = useSelectStore(s => s.item.type);
	const selectedInfo = useSelectStore(s => s.info);
	const flush = useSelectStore(s => s.flush);

    const getContent = () => {
        switch (selectedInfo) {
            case 'INFO': return <InfoForm topo={props.topo} />;
            case 'ACCESS': return <AccessForm accesses={props.topo().accesses} />;
            case 'MANAGEMENT': return <ManagementForm managers={props.topo().managers} />;
			case 'CONTRIBUTORS': return <ContributorsList contributors={props.topo().contributors} topoCreatorId={props.topo().creator?.id} />;
			case 'SEARCHBAR': if (bp === 'mobile') return <SearchbarBouldersMobile topo={props.topo} boulderOrder={props.boulderOrder} map={props.map} />;
			case 'FILTERS': if (bp === 'mobile') return <BouldersFiltersMobile Filters={props.Filters} onResetClick={props.onFilterReset} />;
			default: return undefined;
        }
    }

	const onClose = () => {
		if (bp === 'mobile') flush.all();
		else flush.info()
	}

	return (
		<>
			{bp === "mobile" && (
				<SlideoverMobile 
					open={selectedInfo !== 'NONE' && selectedType === 'none'}
					height={selectedInfo === 'FILTERS' ? 50 : undefined}
					onClose={onClose}
				>
					<div className="flex flex-col h-full px-4 pt-12">
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{bp !== "mobile" && (
				<SlideoverLeftDesktop
					open={selectedInfo !== 'NONE' && selectedInfo !== 'SEARCHBAR' && selectedInfo !== 'FILTERS'}
					onClose={onClose}
				>
					{getContent()}
				</SlideoverLeftDesktop>
			)}
		</>
	);
};

SlideoverLeftBuilder.displayName = "SlideoverLeftBuilder"