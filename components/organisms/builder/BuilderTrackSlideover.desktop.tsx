import React from "react";
import { watchDependencies } from "helpers/quarky";
import { TrackForm } from "../form/TrackForm";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";
import { SlideoverRightDesktop } from "components/atoms/overlays/SlideoverRightDesktop";

export const BuilderTrackSlideoverDesktop: React.FC =
	watchDependencies(() => {
		const selectedTrack = useSelectStore(s => s.item as SelectedBoulder).selectedTrack;
		const flushTrack = useSelectStore(s => s.flush.track);

		return (
			<SlideoverRightDesktop
				className="overflow-scroll"
				open={!!selectedTrack}
				secondary
				onClose={flushTrack}
			>
				{selectedTrack &&
					<TrackForm />
				}
			</SlideoverRightDesktop>
		);
	});

	BuilderTrackSlideoverDesktop.displayName = "BuilderTrackSlideoverDesktop";
