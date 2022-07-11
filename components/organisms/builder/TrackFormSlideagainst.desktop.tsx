import React from "react";
import { SlideagainstRightDesktop } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Track } from "types";
import { TrackForm } from "../form/TrackForm";
import { useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";

interface TrackFormSlideagainstDesktopProps {
	track: Quark<Track>;
	onClose: () => void;
	onDeleteTrack: () => void;
}

export const TrackFormSlideagainstDesktop: React.FC<TrackFormSlideagainstDesktopProps> =
	watchDependencies((props: TrackFormSlideagainstDesktopProps) => {
		const [ModalDelete, showModalDelete] = useModal();

		return (
			<>
				<SlideagainstRightDesktop
					className="overflow-scroll"
					open
					secondary
					onClose={props.onClose}
				>
					<div className="h-full px-5 py-3">
						<TrackForm track={props.track} onDeleteTrack={showModalDelete} />
					</div>
				</SlideagainstRightDesktop>

				<ModalDelete
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={props.onDeleteTrack}
				>
					Etes-vous sûr de vouloir supprimer la voie ?
				</ModalDelete>
			</>
		);
	});

TrackFormSlideagainstDesktop.displayName = "TrackFormSlideagainstDesktop";
