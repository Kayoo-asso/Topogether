import React from "react";
import { GradeCircle, SlideagainstRightDesktop } from "components";
import { Signal } from "helpers/quarky";
import { gradeToLightGrade, Orientation, Track } from "types";
import { OrientationName, ReceptionName } from "types/EnumNames";
import { listFlags, ClimbTechniquesName } from "helpers/bitflags";

interface TrackSlideagainstDesktopProps {
	track: Signal<Track>;
	open?: boolean;
	onClose: () => void;
}

export const TrackSlideagainstDesktop: React.FC<
	TrackSlideagainstDesktopProps
> = ({ open = true, ...props }: TrackSlideagainstDesktopProps) => {
	const track = props.track();

	return (
		<SlideagainstRightDesktop
			className="overflow-scroll"
			open={open}
			secondary
			onClose={props.onClose}
		>
			<div className="mb-10 flex flex-col px-6">
				<div className="mb-2 flex flex-row items-center">
					<GradeCircle grade={gradeToLightGrade(track.grade)} />
					<div className="ktext-big-title ml-3">{track.name}</div>
				</div>

				{track.isTraverse && (
					<div className="ktext-label text-grey-medium">Traversée</div>
				)}
				{track.isSittingStart && (
					<div className="ktext-label text-grey-medium">Départ assis</div>
				)}
				{track.mustSee && (
					<div className="ktext-label text-grey-medium">Incontournable !</div>
				)}

				<div className="ktext-base-little mt-4">{track.description}</div>

				<div className="mt-4 flex flex-col gap-3">
					<div>
						<span className="ktext-subtitle">Techniques : </span>
						{listFlags(track.techniques!, ClimbTechniquesName).join(", ")}
					</div>

					<div>
						<span className="ktext-subtitle">Réception : </span>
						{ReceptionName[track.reception!]}
					</div>

					<div>
						<span className="ktext-subtitle">Orientation :</span>
						{OrientationName[track.orientation!]}
					</div>
				</div>
			</div>
		</SlideagainstRightDesktop>
	);
};
