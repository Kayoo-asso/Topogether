import React from "react";
import { Quark } from "helpers/quarky";
import { Topo, UUID } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverLeftDesktop, SlideoverMobile } from "components/atoms/overlays";
import { useSelectStore } from "components/pages/selectStore";
import { InfoContent } from "./InfoContent";
import { AccessContent } from "./AccessContent";
import { ManagementContent } from "./ManagementContent";
import { SectorList } from "components/molecules";
import { Map } from "ol";

type SlideoverLeftTopoProps = {
    topo: Quark<Topo>;
	boulderOrder: globalThis.Map<UUID, number>;
	map: Map | null
}

export const SlideoverLeftTopo: React.FC<SlideoverLeftTopoProps> = (props: SlideoverLeftTopoProps) => {
    const breakpoint = useBreakpoint();
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
			case 'SECTOR': return <SectorList
										topoQuark={props.topo}
										boulderOrder={props.boulderOrder}
										map={props.map}
									/>;
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
					open={selectedInfo !== 'NONE' && selectedType === 'none'}
					onClose={onClose}
				>
					<div className="h-full pl-6 pr-3 pt-14">
                        <div className="ktext-title mb-6">{getTitle()}</div>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<SlideoverLeftDesktop
					title={getTitle()}
					open={selectedInfo !== 'NONE'}
					onClose={onClose}
				>
					{getContent()}
				</SlideoverLeftDesktop>
			)}
		</>
	);
};

SlideoverLeftTopo.displayName = "SlideoverLeftTopo"