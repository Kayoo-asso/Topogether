import React, { Dispatch, SetStateAction } from "react";
import { watchDependencies } from "helpers/quarky";
import { TrackForm } from "../form/TrackForm";
import { SlideoverRightDesktop } from "components/atoms/overlays";
import { SelectedBoulder, SelectedItem } from "types/SelectedItems";
import { Portal } from "helpers/hooks";

interface BuilderSlideoverTrackDesktopProps {
	selectedBoulder: SelectedBoulder,
	setSelectedItem: Dispatch<SetStateAction<SelectedItem>>;
}

export const BuilderSlideoverTrackDesktop: React.FC<BuilderSlideoverTrackDesktopProps> =
	watchDependencies((props: BuilderSlideoverTrackDesktopProps) => {
		return (
			<SlideoverRightDesktop
				className="overflow-scroll"
				open={!!props.selectedBoulder.selectedTrack}
				secondary
				onClose={() => props.setSelectedItem({ ...props.selectedBoulder, selectedTrack: undefined })}
			>
				{props.selectedBoulder.selectedTrack &&
					<div className="h-full px-5 py-3">
						<TrackForm 
							boulder={props.selectedBoulder.value()}
							track={props.selectedBoulder.selectedTrack} 
							selectedBoulder={props.selectedBoulder}
							setSelectedItem={props.setSelectedItem}
						/>
					</div>
				}
			</SlideoverRightDesktop>
		);
	});

	BuilderSlideoverTrackDesktop.displayName = "BuilderSlideoverTrackDesktop";
