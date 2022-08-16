import React, { Dispatch, SetStateAction, useCallback } from "react";
import { GradeCircle } from "components";
import { gradeToLightGrade, Track } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { useSession } from "helpers/services";
import DrawIcon from "assets/icons/draw.svg";
import { createTrack } from "helpers/builder";
import { staticUrl } from "helpers/constants";
import { useBreakpoint, useModal } from "helpers/hooks";
import { TrackForm } from "../form/TrackForm";
import { SelectedBoulder, SelectedItem, selectImage, selectTrack } from "types/SelectedItems";

interface TracksListBuilderProps {
	selectedBoulder: SelectedBoulder;
	setSelectedItem: Dispatch<SetStateAction<SelectedItem>>;
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
		const [ModalAddImage, showModalAddImage] = useModal();

		const breakpoint = useBreakpoint();

		const boulder = props.selectedBoulder.value();
		const tracks = boulder.tracks
			.quarks()
			.toArray()
			.sort((t1, t2) => t1().index - t2().index);
		const selectedTrack = props.selectedBoulder.selectedTrack ? props.selectedBoulder.selectedTrack() : undefined;

		const toggleSelectedTrack = useCallback(
			(trackQuark) => {
				const track = trackQuark();
				const selectedTrack = props.selectedBoulder.selectedTrack;
				if (selectedTrack && selectedTrack().id === track.id)
					props.setSelectedItem({ ...props.selectedBoulder, selectedTrack: undefined });
				else {
					if (track.lines.length > 0) {
						const newImage = boulder.images.find(
							(img) => img.id === track.lines.at(0).imageId
						);
						if (!newImage)
							throw new Error(
								"Could not find the first image for the selected track!"
							);
						selectImage(props.selectedBoulder, newImage, props.setSelectedItem);
					}
					selectTrack(props.selectedBoulder.value, trackQuark, props.setSelectedItem)
				}
			},
			[props.selectedBoulder, props.selectedBoulder.selectedTrack, props.setSelectedItem, boulder]
		);

		
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
									(!selectedTrack ? '' :
										selectedTrack.id !== track.id ? 
										" opacity-40" : "")
								}
								onClick={() => toggleSelectedTrack(trackQuark)}
							>
								<div className="flex w-full flex-row items-center">
									<GradeCircle
										grade={grade}
										className="cursor-pointer"
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
												props.setSelectedItem({ ...props.selectedBoulder, selectedTrack: trackQuark });
												props.onDrawButtonClick!();
											}}
										>
											<DrawIcon className="h-6 w-6 stroke-main" />
										</button>
									)}
								</div>
								{selectedTrack?.id === track.id && breakpoint === "mobile" && (
									<TrackForm
										boulder={props.selectedBoulder.value()}
										track={trackQuark}
										selectedBoulder={props.selectedBoulder}
										setSelectedItem={props.setSelectedItem}
										className="mt-8"
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
								props.setSelectedItem({ ...props.selectedBoulder, selectedTrack: newQuarkTrack });
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
