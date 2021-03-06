import React from "react";
import { GradeCircle } from "components";
import { Boulder, gradeToLightGrade, Track } from "types";
import { Quark, SelectQuarkNullable, watchDependencies } from "helpers/quarky";
import { TrackForm } from "../organisms/form/TrackForm";
import { useSession } from "helpers/services";
import DrawIcon from "assets/icons/draw.svg";
import { createTrack, deleteTrack } from "helpers/builder";
import { staticUrl } from "helpers/constants";
import { useBreakpoint, useModal } from "helpers/hooks";

interface TracksListBuilderProps {
	boulder: Quark<Boulder>;
	selectedTrack: SelectQuarkNullable<Track>;
	onTrackClick: (trackQuark: Quark<Track>) => void;
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
	None: "border-grey-light bg-grey-light text-white",
};

export const TracksListBuilder: React.FC<TracksListBuilderProps> =
	watchDependencies((props: TracksListBuilderProps) => {
		const session = useSession();
		const [ModalDelete, showModalDelete] = useModal<Quark<Track>>();
		const [ModalAddImage, showModalAddImage] = useModal();

		const breakpoint = useBreakpoint();

		const boulder = props.boulder();
		const tracks = boulder.tracks
			.quarks()
			.toArray()
			.sort((t1, t2) => t1().index - t2().index);
		const selectedTrack = props.selectedTrack();

		if (!session) return null;
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
									"flex cursor-pointer flex-col border-b border-grey-light px-5 py-5 md:py-3 md:hover:bg-grey-superlight" +
									(props.selectedTrack()
										? props.selectedTrack()!.id !== track.id
											? " opacity-40"
											: ""
										: "")
								}
								onClick={() => props.onTrackClick(trackQuark)}
							>
								<div className="flex w-full flex-row items-center">
									<GradeCircle
										grade={grade}
										className="cursor-pointer"
										content={(track.index + 1).toString()}
										onClick={() => props.onTrackClick(trackQuark)}
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
											<div className="ktext-subtext">Travers??e</div>
										)}
										{track.isSittingStart && (
											<div className="ktext-subtext">D??part assis</div>
										)}
									</div>

									{props.onDrawButtonClick && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												props.selectedTrack.select(trackQuark);
												props.onDrawButtonClick!();
											}}
										>
											<DrawIcon className="h-6 w-6 stroke-main" />
										</button>
									)}
								</div>
								{selectedTrack?.id === track.id && breakpoint === "mobile" && (
									<TrackForm
										track={trackQuark}
										className="mt-8"
										onDeleteTrack={() => showModalDelete(trackQuark)}
									/>
								)}
							</div>
						);
					})}

					<div
						className={
							"border-b border-grey-light px-5 py-5 md:py-3 " +
							(boulder.images.length > 0
								? "cursor-pointer text-grey-medium hover:bg-grey-superlight"
								: "cursor-default text-grey-light")
						}
						onClick={() => {
							if (boulder.images.length > 0) {
								const newQuarkTrack = createTrack(boulder, session!.id);
								props.selectedTrack.select(newQuarkTrack);
								if (props.onCreateTrack) props.onCreateTrack();
							} else showModalAddImage();
						}}
					>
						<span className="ktext-subtitle ml-2 mr-5 text-xl">+</span>{" "}
						<span className="ktext-subtitle">Nouveau passage</span>
					</div>
				</div>

				<ModalDelete
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={(track) =>
						deleteTrack(boulder, track, props.selectedTrack)
					}
				>
					Etes-vous s??r de vouloir supprimer la voie ?
				</ModalDelete>

				<ModalAddImage
					buttonText="Ajouter une image"
					imgUrl={staticUrl.defaultProfilePicture}
					onConfirm={props.onAddImage}
				>
					Vous devez ajouter une premi??re image pour cr??er une voie.
				</ModalAddImage>
			</>
		);
	});

TracksListBuilder.displayName = "TracksListBuilder";
