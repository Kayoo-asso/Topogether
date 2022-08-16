import React, { Dispatch, SetStateAction, useState } from "react";
import {
	BoulderPreviewDesktop,
	Button,
	Flash,
	TracksList,
} from "components";
import { Quark, SelectQuarkNullable, watchDependencies } from "helpers/quarky";
import { Boulder, Img, Track, UUID } from "types";
import { LoginForm } from "..";
import { useSession} from "helpers/services";
import { useModal } from "helpers/hooks";

import Rock from "assets/icons/rock.svg";
import { SlideoverRightDesktop } from "components/atoms/overlays";

interface BoulderSlideagainstDesktopProps {
	boulder: Quark<Boulder>;
	selectedTrack: SelectQuarkNullable<Track>;
	topoCreatorId?: UUID;
	currentImage?: Img;
	setCurrentImage: Dispatch<SetStateAction<Img | undefined>>;
	onClose: () => void;
}

export const BoulderSlideagainstDesktop: React.FC<BoulderSlideagainstDesktopProps> =
	watchDependencies((props: BoulderSlideagainstDesktopProps) => {
		const session = useSession();

		const [flashMessage, setFlashMessage] = useState<string>();
		const [officialTrackTab, setOfficialTrackTab] = useState(true);
		const boulder = props.boulder();

		const displayedTracks = boulder.tracks
			.quarks()
			.filter(
				(track) =>
					(track().creatorId === props.topoCreatorId) === officialTrackTab
			);

		const [ModalLogin, showModalLogin, hideModalLogin] = useModal();

		return (
			<>
				<SlideoverRightDesktop
					open
					displayLikeButton
					item={props.boulder()}
					onClose={props.onClose}
				>
					<>
						<div className="px-5">
							<div className="mb-2 flex flex-row items-end">
								<Rock className="h-7 w-7 stroke-main" />
								<span className={"ktext-big-title ml-3" + (boulder.name.length > 16 ? " text-base" : "")}>{boulder.name}</span>
							</div>
							<div
								className="ktext-label cursor-pointer text-grey-medium"
								onClick={() => {
									const data = [
										new ClipboardItem({
											"text/plain": new Blob(
												[boulder.location[1] + "," + boulder.location[0]],
												{
													type: "text/plain",
												}
											),
										}),
									];
									navigator.clipboard.write(data).then(
										function () {
											setFlashMessage(
												"Coordonnées copiées dans le presse papier."
											);
										},
										function () {
											setFlashMessage("Impossible de copier les coordonées.");
										}
									);
								}}
							>
								{parseFloat(boulder.location[1].toFixed(12)) +
									"," +
									parseFloat(boulder.location[0].toFixed(12))}
							</div>
							{boulder.isHighball && (
								<div className="ktext-label text-grey-medium">High Ball</div>
							)}
							{boulder.mustSee && (
								<div className="ktext-label mb-15 text-grey-medium">
									Incontournable !
								</div>
							)}
						</div>
						<div className="mt-3">
							<BoulderPreviewDesktop
								selectedBoulder={props.boulder}
								selectedTrack={props.selectedTrack}
								currentImage={props.currentImage}
								setCurrentImage={props.setCurrentImage}
							/>
						</div>

						<div className="ktext-label my-2 mt-10 flex flex-row justify-between px-5 font-bold">
							<span
								className={`cursor-pointer ${
									officialTrackTab ? "text-main" : "text-grey-medium"
								}`}
								onClick={() => setOfficialTrackTab(true)}
							>
								officielles
							</span>
							<span
								className={`cursor-pointer ${
									!officialTrackTab ? "text-main" : "text-grey-medium"
								}`}
								onClick={() => setOfficialTrackTab(false)}
							>
								communautés
							</span>
						</div>

						<div className="overflow-auto">
							<TracksList
								tracks={displayedTracks}
								selectedTrack={props.selectedTrack}
								onTrackClick={(trackQuark) => {
									if (props.selectedTrack()?.id === trackQuark().id)
										props.selectedTrack.select(undefined);
									else {
										const track = trackQuark();
										if (track.lines.length > 0) {
											const newImage = boulder.images.find(
												(img) => img.id === trackQuark().lines.at(0).imageId
											);
											if (!newImage)
												throw new Error(
													"Could not find the first image for the selected track!"
												);
											props.setCurrentImage(newImage);
										}
										props.selectedTrack.select(trackQuark);
									}
								}}
							/>
						</div>
						{!officialTrackTab && (
							<div className="mt-4 flex flex-col items-center px-5">
								<Button
									content="Ajouter une voie"
									fullWidth
									onClick={() => {
										if (session) alert("à venir"); //TODO
										else showModalLogin();
									}}
								/>
							</div>
						)}
					</>
				</SlideoverRightDesktop>

				<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
					{flashMessage}
				</Flash>

				<ModalLogin>
					<div className="mt-4 p-8">
						<div className="mb-8 text-center">
							Pour ajouter une voie "Communauté", vous devez être connecté.
						</div>
						<LoginForm onLogin={() => hideModalLogin()} />
					</div>
				</ModalLogin>
			</>
		);
	});

BoulderSlideagainstDesktop.displayName = "BoulderSlideagainstDesktop";
