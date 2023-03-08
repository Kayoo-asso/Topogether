import React, { useCallback, useState } from "react";
import { Quark, QuarkIter } from "helpers/quarky";
import { Topo } from "types";
import { useSelectStore } from "components/store/selectStore";
import { ParkingContent } from "./ParkingContent";
import { WaypointContent } from "./WaypointContent";
import { BoulderContentMobile } from "./BoulderContent.mobile";
import { BoulderContentDesktop } from "./BoulderContent.desktop";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { SlideoverMobile } from "components/atoms/overlays/SlideoverMobile";
import { SlideoverRightDesktop } from "components/atoms/overlays/SlideoverRightDesktop";
import { TracksImage } from "components/molecules/TracksImage";
import { TrackContent } from "./TrackContent";

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
	const isTrackSelected = !!(item.type === 'boulder' && item.selectedTrack && item.selectedImage);

	const onClose = () => {
		if (bp === 'mobile') flush.all();
		else if (isTrackSelected) flush.track();
		else flush.item();
	};

	const getContent = useCallback(() => {
		switch (item.type) {
			case 'sector': return undefined;
			case 'boulder': {
				if (bp === "mobile") return (
					<BoulderContentMobile
						full={full}
						// TODO Props to del when tracks and boulder will have a flag 'official'
						topoCreatorId={props.topo().creator!.id}
					/>);
				else {
					if (isTrackSelected) return (<TrackContent />);
					else return (
						<BoulderContentDesktop
							// TODO Props to del when tracks and boulder will have a flag 'official'
							topoCreatorId={props.topo().creator!.id}
						/>
					);
				}
			}
			case 'parking': return <ParkingContent />;
			case 'waypoint': return <WaypointContent />;;
			default: return undefined;
		}
	}, [full, bp, item.type, isTrackSelected]);

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
						open={item.type !== 'sector'}
						onClose={onClose}
					>
						<div className="h-full">{getContent()}</div>
					</SlideoverRightDesktop>

					{isTrackSelected &&
						<div className="absolute top-0 z-1000 flex h-full w-full flex-col bg-black bg-opacity-90 md:w-[calc(100%-300px)]">
							<div className="relative flex h-full flex-1 items-center">
								<TracksImage
									image={item.selectedImage}
									sizeHint="100vw"
									tracks={new QuarkIter([item.selectedTrack!])}
									displayTracksDetails
								/>
							</div>
						</div>
					}
				</>
			)}
		</>
	);
};

SlideoverRightTopo.displayName = "SlideoverRightTopo";
