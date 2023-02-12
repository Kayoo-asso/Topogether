import React from "react";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";
import { TrackContent } from "./TrackContent";
import { SlideoverRightDesktop } from "components/atoms/overlays/SlideoverRightDesktop";

export const TopoTrackSlideoverDesktop: React.FC = () => {
	const selectedTrack = useSelectStore(s => s.item as SelectedBoulder).selectedTrack;
	const flushTrack = useSelectStore(s => s.flush.track);

	return (
		<SlideoverRightDesktop
			className="overflow-scroll"
			open={!!selectedTrack}
			secondary
			onClose={flushTrack}
		>
			<TrackContent />
		</SlideoverRightDesktop>
	);
};

	TopoTrackSlideoverDesktop.displayName = "TopoTrackSlideoverDesktop";
