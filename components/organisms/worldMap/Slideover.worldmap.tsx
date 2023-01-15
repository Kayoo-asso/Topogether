import React from "react";
import { LightTopo } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverLeftDesktop, SlideoverMobile } from "components/atoms/overlays";
import { useSelectStore } from "components/pages/selectStore";
import { Map } from "ol";
import { SearchbarTopos } from "components/map/SearchbarTopos";

type SlideoverWorldmapProps = {
    topos: LightTopo[];
	map: Map | null;
}

export const SlideoverWorldmap: React.FC<SlideoverWorldmapProps> = (props: SlideoverWorldmapProps) => {
    const breakpoint = useBreakpoint();
	const selectedInfo = useSelectStore(s => s.info);
	const flush = useSelectStore(s => s.flush);

    const getContent = () => {
        switch (selectedInfo) {
			case 'SEARCHBAR': return <SearchbarTopos topos={props.topos} map={props.map} />;
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
					open={selectedInfo === 'SEARCHBAR'}
					onClose={onClose}
				>
					<div className="h-full pl-6 pr-3 pt-14">
                        <div className="ktext-title mb-6"></div>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<SlideoverLeftDesktop
					open={selectedInfo === 'SEARCHBAR'}
					onClose={onClose}
				>
					{getContent()}
				</SlideoverLeftDesktop>
			)}
		</>
	);
};

SlideoverWorldmap.displayName = "SlideoverWorldmap"