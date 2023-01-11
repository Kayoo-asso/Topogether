import React, { useCallback } from "react";
import { GradeCircle } from "components";
import { gradeToLightGrade } from "types";
import { watchDependencies } from "helpers/quarky";
import { useSession } from "helpers/services";
import DrawIcon from "assets/icons/draw.svg";
import { createTrack } from "helpers/builder";
import { staticUrl } from "helpers/constants";
import { useBreakpoint, useModal } from "helpers/hooks";
import { TrackForm } from "../form/TrackForm";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";

interface TracksListBuilderProps {
	onDrawButtonClick?: () => void;
	onCreateTrack?: () => void;
	onAddImage?: () => void;
}

const gradeColors = {
	3: "text-grade-3",
	4: "text-grade-4",
	5: "text-grade-5",
	6: "text-grade-6",
	7: "text-grade-7",
	8: "text-grade-8",
	9: "text-grade-9",
	P: "border-grey-light bg-grey-light text-white",
};

export const TracksListBuilder: React.FC<TracksListBuilderProps> =
	watchDependencies((props: TracksListBuilderProps) => {
		const session = useSession();
		if (!session) return null;
		const breakpoint = useBreakpoint();
		
		const select = useSelectStore(s => s.select);
		const flushTrack = useSelectStore(s => s.flush.track);
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const selectedTrack = selectedBoulder.selectedTrack;

		const boulder = selectedBoulder.value()
		const tracks = boulder.tracks
			.quarks()
			.toArray()
			.sort((t1, t2) => t1().index - t2().index);

		const toggleSelectedTrack = useCallback(
			(trackQuark) => {
				const track = trackQuark();
				if (selectedTrack && selectedTrack().id === track.id) flushTrack();
				else select.track(trackQuark, selectedBoulder.value);
			},
			[selectedTrack, boulder, select, flushTrack]
		);

		const [ModalAddImage, showModalAddImage] = useModal();

		return (
			<>
				<div className="w-full border-t border-grey-light">
					{tracks.map((trackQuark) => {
						const track = trackQuark();
						const grade = gradeToLightGrade(track.grade);
						return (
							<div
								key={track.id}
								className={
									"flex md:cursor-pointer flex-col border-b border-grey-light px-5 py-5 md:py-3 md:hover:bg-grey-superlight" +
									(!selectedTrack ? '' :
										selectedTrack().id !== track.id ? 
										" opacity-40" : "")
								}
								onClick={() => toggleSelectedTrack(trackQuark)}
							>
								<div className="flex w-full flex-row items-center">
									<GradeCircle
										grade={grade}
										className="md:cursor-pointer"
										content={(track.index + 1).toString()}
										onClick={() => toggleSelectedTrack(trackQuark)}
									/>

									{track.grade && (
										<div
											className={`ktext-subtitle ml-3 text-right ${gradeColors[grade]}`}
										>
											{track.grade}
										</div>
									)}
									<div className="ml-4 flex w-3/4 flex-col">
										<span className="ktext-base">{track.name}</span>
										{track.isTraverse && (
											<div className="ktext-subtext">Traversée</div>
										)}
										{track.isSittingStart && (
											<div className="ktext-subtext">Départ assis</div>
										)}
									</div>

									{props.onDrawButtonClick && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												select.track(trackQuark, selectedBoulder.value);
												props.onDrawButtonClick!();
											}}
										>
											<DrawIcon className="h-6 w-6 stroke-main" />
										</button>
									)}
								</div>
								{selectedTrack && selectedTrack().id === track.id && breakpoint === "mobile" && (
									<TrackForm className="mt-8" />
								)}
							</div>
						);
					})}

					<div
						className={
							"border-b border-grey-light px-5 py-5 md:py-3 " +
							(boulder.images.length > 0
								? "md:cursor-pointer text-grey-medium hover:bg-grey-superlight"
								: "cursor-default text-grey-light")
						}
						onClick={() => {
							if (boulder.images.length > 0) {
								select.track(createTrack(boulder, session!.id), selectedBoulder.value);
								if (props.onCreateTrack) props.onCreateTrack();
							} else showModalAddImage();
						}}
					>
						<span className="ktext-subtitle ml-2 mr-5 text-xl">+</span>{" "}
						<span className="ktext-subtitle">Nouveau passage</span>
					</div>
				</div>

				<ModalAddImage
					buttonText="Ajouter une image"
					imgUrl={staticUrl.defaultProfilePicture}
					onConfirm={props.onAddImage}
				>
					Vous devez ajouter une première image pour créer une voie.
				</ModalAddImage>
			</>
		);
	});

TracksListBuilder.displayName = "TracksListBuilder";
