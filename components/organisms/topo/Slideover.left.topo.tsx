import React from "react";
import { Quark } from "helpers/quarky";
import { Topo, UUID } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverLeftDesktop, SlideoverMobile } from "components/atoms/overlays";
import { useSelectStore } from "components/pages/selectStore";
import { InfoContent } from "./InfoContent";
import { AccessContent } from "./AccessContent";
import { ManagementContent } from "./ManagementContent";
import { Map } from "ol";
import { SearchbarBouldersMobile } from "components/map/searchbar/SearchbarBoulders.mobile";
import { BouldersFiltersComponents } from "components/map/filters/useBouldersFilters";
import { BouldersFiltersMobile } from "components/map/filters/BouldersFilters.mobile";

type SlideoverLeftTopoProps = {
    topo: Quark<Topo>;
	boulderOrder: globalThis.Map<UUID, number>;
	map: Map | null;
	Filters: BouldersFiltersComponents;
	onFilterReset: () => void;
}

export const SlideoverLeftTopo: React.FC<SlideoverLeftTopoProps> = (props: SlideoverLeftTopoProps) => {
    const bp = useBreakpoint();
	const selectedType = useSelectStore(s => s.item.type);
	const selectedInfo = useSelectStore(s => s.info);
	const flush = useSelectStore(s => s.flush);

    const getTitle = () => {
        switch (selectedInfo) {
            case 'INFO': return "Infos du topo";
            case 'ACCESS': return "Marche d'approche";
            case 'MANAGEMENT': return "Gestionnaires du site";
            default: return undefined;
        }
    }

    const getContent = () => {
        switch (selectedInfo) {
            case 'INFO': return <InfoContent topo={props.topo} />;
            case 'ACCESS': return <AccessContent accesses={props.topo().accesses} />;
            case 'MANAGEMENT': return <ManagementContent managers={props.topo().managers} />;
			case 'SEARCHBAR': if (bp === 'mobile') return <SearchbarBouldersMobile topo={props.topo} boulderOrder={props.boulderOrder} map={props.map} />;
			case 'FILTERS': if (bp === 'mobile') return <BouldersFiltersMobile Filters={props.Filters} onResetClick={props.onFilterReset}  />;
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
					<div className="h-full pl-6 pr-3 pt-12">
                        <div className={`${selectedInfo === 'FILTERS' || selectedInfo === 'SEARCHBAR' ? 'hidden' : 'ktext-title mb-6'}`}>
							{getTitle()}
						</div>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{bp !== "mobile" && (
				<SlideoverLeftDesktop
					title={getTitle()}
					open={selectedInfo !== 'NONE' && selectedInfo !== 'SEARCHBAR' && selectedInfo !== 'FILTERS'}
					onClose={onClose}
				>
					{getContent()}
				</SlideoverLeftDesktop>
			)}
		</>
	);
};

SlideoverLeftTopo.displayName = "SlideoverLeftTopo"