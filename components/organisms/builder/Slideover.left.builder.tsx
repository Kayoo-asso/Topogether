import React from "react";
import { AccessForm, InfoForm, ManagementForm } from "../form";
import { Quark } from "helpers/quarky";
import { Topo, UUID } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverLeftDesktop, SlideoverMobile } from "components/atoms/overlays";
import { useSelectStore } from "components/pages/selectStore";
import { SectorBuilderContentMobile } from "./SectorBuilderContent.mobile";

type SlideoverLeftBuilderProps = {
    topo: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	map: google.maps.Map | null
}

export const SlideoverLeftBuilder: React.FC<SlideoverLeftBuilderProps> = (props: SlideoverLeftBuilderProps) => {
    const breakpoint = useBreakpoint();
	const selectedInfo = useSelectStore(s => s.info);
	const flush = useSelectStore(s => s.flush);

    const getContent = () => {
        switch (selectedInfo) {
            case 'INFO': return <InfoForm topo={props.topo} />;
            case 'ACCESS': return <AccessForm accesses={props.topo().accesses} />;
            case 'MANAGEMENT': return <ManagementForm managers={props.topo().managers} />;
			case 'SECTOR': return <SectorBuilderContentMobile topoQuark={props.topo} boulderOrder={props.boulderOrder} map={props.map} />
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
					open={selectedInfo !== 'NONE'}
					onClose={onClose}
				>
					<div className="flex flex-col h-full px-4 pt-14">
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<SlideoverLeftDesktop
					open={selectedInfo !== 'NONE'}
					onClose={onClose}
				>
					{getContent()}
				</SlideoverLeftDesktop>
			)}
		</>
	);
};

SlideoverLeftBuilder.displayName = "SlideoverLeftBuilder"