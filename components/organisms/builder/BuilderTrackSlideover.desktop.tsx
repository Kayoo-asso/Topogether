import React from "react";
import { watchDependencies } from "helpers/quarky";
import { TrackForm } from "../form/TrackForm";
import { SlideoverRightDesktop } from "components/atoms/overlays";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";

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
					<div className="h-full px-5 py-3">
						<TrackForm />
					</div>
				}
			</SlideoverRightDesktop>
		);
	});

	BuilderTrackSlideoverDesktop.displayName = "BuilderTrackSlideoverDesktop";
