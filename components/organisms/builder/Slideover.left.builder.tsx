import React from "react";
import { AccessForm, InfoForm, ManagementForm } from "../form";
import { Quark } from "helpers/quarky";
import { Topo, UUID } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverLeftDesktop, SlideoverMobile } from "components/atoms/overlays";
import { useSelectStore } from "components/pages/selectStore";
import { ContributorsList } from "./ContributorsList";
import { Map } from "ol";
import { SearchbarBouldersMobile } from "components/map/searchbar/SearchbarBoulders.mobile";
import { BouldersFiltersComponents } from "components/map/filters/useBouldersFilters";
import { BouldersFiltersMobile } from "components/map/filters/BouldersFilters.mobile";

type SlideoverLeftBuilderProps = {
    topo: Quark<Topo>;
	boulderOrder: globalThis.Map<UUID, number>;
	map: Map | null;
	Filters: BouldersFiltersComponents;
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
			case 'FILTERS': if (bp === 'mobile') return <BouldersFiltersMobile Filters={props.Filters} />;
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
					onClose={onClose}
				>
					<div className="flex flex-col h-full px-4 pt-14">
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