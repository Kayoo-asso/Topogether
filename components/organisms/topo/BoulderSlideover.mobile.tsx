import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
	GradeScale,
	LikeButton,
	SlideoverMobile,
	Show,
	ImageSlider,
} from "components";
import { Boulder, Image, Track, UUID } from "types";
import { Quark, watchDependencies, SelectQuarkNullable } from "helpers/quarky";
import { TracksList } from "..";
import { CFImage } from "components/atoms/CFImage";
import ManyTracks from "assets/icons/many-tracks.svg";
import AddIcon from "assets/icons/add.svg";

interface BoulderSlideoverMobileProps {
	boulder: Quark<Boulder>;
	open?: boolean;
	selectedTrack: SelectQuarkNullable<Track>;
	topoCreatorId?: UUID;
	currentImage?: Image;
	setCurrentImage: Dispatch<SetStateAction<Image | undefined>>;
	onClose: () => void;
}

export const BoulderSlideoverMobile: React.FC<BoulderSlideoverMobileProps> =
	watchDependencies(
		({ open = true, ...props }: BoulderSlideoverMobileProps) => {
			const [full, setFull] = useState(false);
			const [officialTrackTab, setOfficialTrackTab] = useState(true);

			const boulder = props.boulder();
			const selectedTrack = props.selectedTrack();

			const [displayPhantomTracks, setDisplayPhantomTracks] = useState(false);
			const displayedTracks = useMemo(
				() =>
					boulder.tracks
						.quarks()
						.filter(
							(track) =>
								(track().creatorId === props.topoCreatorId) === officialTrackTab
						),
				[boulder.tracks, props.topoCreatorId, officialTrackTab]
			);

			// const sortBoulderImages = (boulder: Boulder) => {
			//   console.log(boulder.images);
			//   const buff: { img: Image, idx: number }[] = [];
			//   for (const img of boulder.images) {
			//     buff.push({
			//       img,
			//       idx: boulder.tracks.find(t => !!t.lines?.find(l => l.imageId === img.id))?.index || boulder.images.length + 1
			//     })
			//   }
			//   const newImgs = buff.sort((b1, b2) => (b2.idx - b1.idx)).map(b => b.img);
			//   console.log(newImgs);
			// }
			// sortBoulderImages(boulder);

			return (
				<SlideoverMobile
					persistent
					onSizeChange={setFull}
					onClose={props.onClose}
				>
					{/* BOULDER IMAGE */}
					{full && (
						<div className="relative flex max-h-[40%] w-full overflow-hidden rounded-t-lg bg-dark">
							<ImageSlider
								images={boulder.images}
								currentImage={props.currentImage}
								setCurrentImage={props.setCurrentImage}
								tracks={boulder.tracks.quarks()}
								selectedTrack={props.selectedTrack}
								displayPhantomTracks={displayPhantomTracks}
							/>
						</div>
					)}

					<div className="flex h-[60%] flex-col">
						{/* BOULDER INFOS */}
						<div
							className={`grid grid-cols-8 items-center p-5 ${
								full ? "" : " mt-3"
							}`}
						>
							<div className="col-span-6">
								<div className="ktext-section-title">{boulder.name}</div>
								{boulder.isHighball && full && (
									<div className="ktext-base-little">High Ball</div>
								)}
								{boulder.dangerousDescent && full && (
									<div className="ktext-base-little">Descente dangereuse !</div>
								)}
								{!full && (
									<div className="mt-2 flex items-center">
										<GradeScale boulder={boulder} circleSize="little" />
									</div>
								)}
							</div>

							<div className="col-span-2 flex flex-row justify-end gap-5">
								{selectedTrack && boulder.tracks.length > 1 && (
									<button
										onClick={() =>
											setDisplayPhantomTracks(!displayPhantomTracks)
										}
									>
										<ManyTracks
											className={
												"h-6 w-6 " +
												(displayPhantomTracks
													? "stroke-main"
													: "stroke-grey-medium")
											}
										/>
									</button>
								)}
								{full && <LikeButton liked={boulder.liked} />}

								{!full && (
									<div className="relative h-[60px] w-full overflow-hidden rounded-sm">
										<CFImage
											image={boulder.images[0]}
											objectFit="contain"
											alt="Boulder"
											sizeHint="100vw"
										/>
									</div>
								)}
							</div>
						</div>

						{/* TODO : show once good pattern */}
						{/* TABS */}
						{full && (
							<div className="ktext-label my-2 flex w-full flex-row gap-8 px-5 font-bold">
								<span
									className={`${
										officialTrackTab ? "text-main" : "text-grey-medium"
									}`}
									onClick={() => setOfficialTrackTab(true)}
								>
									officielles
								</span>
								<span
									className={`${
										!officialTrackTab ? "text-main" : "text-grey-medium"
									}`}
									onClick={() => setOfficialTrackTab(false)}
								>
									communaut??s
								</span>
								<span className="flex w-full justify-end">
									<button
										onClick={() => console.log("create community track")} // TODO
									>
										<AddIcon className="h-5 w-5 stroke-main" />
									</button>
								</span>
							</div>
						)}

						{/* TRACKSLIST */}
						<Show when={() => full}>
							<div className="overflow-auto pb-[30px]">
								<TracksList
									tracks={displayedTracks}
									selectedTrack={props.selectedTrack}
									onTrackClick={(trackQuark) => {
										if (props.selectedTrack()?.id === trackQuark().id)
											props.selectedTrack.select(undefined);
										else {
											const newImageIndex = boulder.images.findIndex(
												(img) => img.id === trackQuark().lines?.at(0).imageId
											);
											if (newImageIndex > -1)
												props.setCurrentImage(boulder.images[newImageIndex]);
											props.selectedTrack.select(trackQuark);
										}
									}}
								/>
							</div>
						</Show>
					</div>
				</SlideoverMobile>
			);
		}
	);

BoulderSlideoverMobile.displayName = "BoulderSlideoverMobile";
