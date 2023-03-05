import React, { useCallback, useState } from "react";
import { Quark, QuarkIter } from "helpers/quarky";
import { Topo } from "types";
import { useSelectStore } from "components/store/selectStore";
import { ParkingContent } from "./ParkingContent";
import { WaypointContent } from "./WaypointContent";
import { BoulderContentMobile } from "./BoulderContent.mobile";
import { BoulderContentDesktop } from "./BoulderContent.desktop";
import { TopoTrackSlideoverDesktop } from "./TopoTrackSlideover.desktop";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { SlideoverMobile } from "components/atoms/overlays/SlideoverMobile";
import { SlideoverRightDesktop } from "components/atoms/overlays/SlideoverRightDesktop";
import { TracksImage } from "components/molecules/TracksImage";

type SlideoverRightTopoProps = {
	topo: Quark<Topo>;
};

export const SlideoverRightTopo: React.FC<SlideoverRightTopoProps> = (
	props: SlideoverRightTopoProps
) => {
	const bp = useBreakpoint();
	const [full, setFull] = useState(false);
	const flush = useSelectStore(s => s.flush);
	const item = useSelectStore(s => s.item);

	const onClose = () => {
		if (bp === 'mobile') flush.all();
		else flush.item();
	};

	const getContent = useCallback(() => {
		if (item.type !== 'none' && item.type !== 'sector') {
			if (item.type === 'boulder') {
				if (bp === "mobile")	
					return (
						<BoulderContentMobile
							full={full}
							// TODO Props to del when tracks and boulder will have a flag 'official'
							topoCreatorId={props.topo().creator!.id}
						/>
					);
				return (
					<BoulderContentDesktop
						// TODO Props to del when tracks and boulder will have a flag 'official'
						topoCreatorId={props.topo().creator!.id}
					/>
				);
			}
			else if (item.type === 'parking') return <ParkingContent />;
			else if (item.type === "waypoint") return <WaypointContent />;
		} else return undefined;
	}, [full, bp, item]);

	return (
		<>
			{bp === "mobile" && item.type !== 'none' && (
				<SlideoverMobile
					open={item.type !== 'sector'}
					persistent={item.type === 'boulder'}
					onSizeChange={setFull}
					onClose={onClose}
				>
					<div className="h-full">
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{bp !== "mobile" && item.type !== 'none' && (
				<>
					<SlideoverRightDesktop
						item={item.type === 'boulder' ? item.value() : undefined}
						open={item.type !== 'sector'}
						onClose={onClose}
					>
						<div className="h-full">{getContent()}</div>
					</SlideoverRightDesktop>

					{item.type === 'boulder' && item.selectedTrack &&
						<>
							<TopoTrackSlideoverDesktop />
							<div className="absolute top-0 z-1000 flex h-full w-full flex-col bg-black bg-opacity-90 md:w-[calc(100%-600px)]">
								<div className="relative flex h-full flex-1 items-center">
									<TracksImage
										image={item.selectedImage}
										sizeHint="100vw"
										tracks={new QuarkIter([item.selectedTrack])}
										displayTracksDetails
									/>
								</div>
							</div>
						</>
					}
				</>
			)}
		</>
	);
};

SlideoverRightTopo.displayName = "SlideoverRightTopo";
