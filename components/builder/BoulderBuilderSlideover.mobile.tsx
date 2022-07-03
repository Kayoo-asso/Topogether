import React, { Dispatch, SetStateAction, useState } from "react";
import { GradeScale, SlideoverMobile, ImageSlider } from "components";
import { Boulder, Image, Topo, Track } from "types";
import { Quark, watchDependencies, SelectQuarkNullable } from "helpers/quarky";
import { TracksListBuilder } from ".";
import { BoulderForm } from "..";
import { CFImage } from "components/atoms/CFImage";
import { ImageInput } from "components/molecules";
import { Button } from "components/atoms";

interface BoulderBuilderSlideoverMobileProps {
	boulder: Quark<Boulder>;
	topo: Quark<Topo>;
	selectedTrack: SelectQuarkNullable<Track>;
	currentImage?: Image;
	setCurrentImage: Dispatch<SetStateAction<Image | undefined>>;
	onDrawButtonClick: () => void;
	onCreateTrack: () => void;
	onBoulderDelete: (boulder: Quark<Boulder>) => void;
	onClose: () => void;
}

export const BoulderBuilderSlideoverMobile: React.FC<BoulderBuilderSlideoverMobileProps> =
	watchDependencies((props: BoulderBuilderSlideoverMobileProps) => {
		const boulder = props.boulder();
		const selectedTrack = props.selectedTrack();

		const [full, setFull] = useState(!!selectedTrack);
		const [trackTab, setTrackTab] = useState(true);

		const [imageToDisplayIdx, setImageToDisplayIdx] = useState(0);

		return (
			<SlideoverMobile
				persistent
				onSizeChange={setFull}
				onClose={props.onClose}
			>
				{/* BOULDER IMAGE */}
				{full && (
					<div className="flex w-full bg-dark rounded-t-lg relative overflow-hidden max-h-[40%]">
						<ImageSlider
							images={boulder.images}
							imageToDisplayIdx={imageToDisplayIdx}
							tracks={boulder.tracks.quarks()}
							selectedTrack={props.selectedTrack}
							onChange={(idx) => {
								setImageToDisplayIdx(idx);
								props.setCurrentImage(boulder.images[idx]);
							}}
						/>
					</div>
				)}

				<div className="flex flex-col h-[60%]">
					{/* BOULDER INFOS */}
					<div
						className={`grid grid-cols-8 p-5 items-center ${
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
								<div className="flex items-center mt-2">
									<GradeScale boulder={boulder} circleSize="little" />
								</div>
							)}
						</div>

						<div className="flex flex-row items-center gap-6 justify-end col-span-2">
							{/* {selectedTrack && boulder.tracks.filter(track => track.lines.toArray().some(line => line.imageId === props.currentImage?.id)).toArray().length > 1 &&
              <button
                onClick={() => setDisplayPhantomTracks(!displayPhantomTracks)}
              >
                <ManyTracks
                  className={'w-6 h-6 ' + (displayPhantomTracks ? 'stroke-main' : 'stroke-grey-medium')}
                />
              </button>
            } */}
							{full && (
								<ImageInput
									button="builder"
									onChange={(imgs) => {
										props.boulder.set((b) => ({
											...b,
											images: [...boulder.images].concat(imgs),
										}));
										props.setCurrentImage(imgs[0]);
									}}
								/>
							)}

							{!full && (
								<div className="w-full relative h-[60px]">
									<CFImage
										image={boulder.images[0]}
										className="rounded-sm"
										objectFit="contain"
										alt="Boulder"
										sizeHint={"50vw"}
									/>
								</div>
							)}
						</div>
					</div>

					{/* TODO : show once good pattern */}
					{/* TABS */}
					{full && (
						<div className="flex flex-row px-5 ktext-label font-bold my-2">
							<span
								className={`w-1/4 ${
									trackTab ? "text-main" : "text-grey-medium"
								}`}
								onClick={() => setTrackTab(true)}
							>
								Voies
							</span>
							<span
								className={`w-3/4 ${
									!trackTab ? "text-main" : "text-grey-medium"
								}`}
								onClick={() => setTrackTab(false)}
							>
								Infos du bloc
							</span>
						</div>
					)}

					{/* TRACKSLIST */}
					{trackTab && full && (
						<div className="overflow-auto pb-[30px]">
							<TracksListBuilder
								boulder={props.boulder}
								selectedTrack={props.selectedTrack}
								onDrawButtonClick={props.onDrawButtonClick}
								onTrackClick={(trackQuark) => {
									const newImageIndex = boulder.images.findIndex(
										(img) => img.id === trackQuark().lines?.at(0)?.imageId
									);
									if (props.selectedTrack()?.id === trackQuark().id)
										props.selectedTrack.select(undefined);
									else {
										if (newImageIndex > -1) {
											props.setCurrentImage(boulder.images[newImageIndex]);
											setImageToDisplayIdx(newImageIndex);
										}
										props.selectedTrack.select(trackQuark);
									}
								}}
								onCreateTrack={props.onCreateTrack}
							/>
						</div>
					)}

					{/* BOULDER FORM */}
					{!trackTab && full && (
						<div className="border-t border-grey-light px-6 py-10 overflow-auto">
							<BoulderForm boulder={props.boulder} topo={props.topo} />
							<Button
								content="Supprimer le bloc"
								className="mt-10"
								fullWidth
								onClick={() => props.onBoulderDelete(props.boulder)}
							/>
						</div>
					)}
				</div>
			</SlideoverMobile>
		);
	});

BoulderBuilderSlideoverMobile.displayName = "BoulderBuilderSlideoverMobile";
