import React, { Dispatch, SetStateAction, useState } from "react";
import { GradeScale, ImageSlider } from "components";
import { Boulder, Img, Topo, Track } from "types";
import { Quark, watchDependencies, SelectQuarkNullable } from "helpers/quarky";
import { TracksListBuilder } from ".";
import { BoulderForm } from "..";
import { Image } from "components/atoms/Image";
import { ImageInput } from "components/molecules";
import { Button } from "components/atoms";
import { useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";

interface BoulderBuilderContentMobileProps {
	full: boolean,
	boulder: Quark<Boulder>;
	topo: Quark<Topo>;
	selectedTrack: SelectQuarkNullable<Track>;
	currentImage?: Img;
	setCurrentImage: Dispatch<SetStateAction<Img | undefined>>;
	setDisplayDrawer: Dispatch<SetStateAction<boolean>>;
	onDeleteBoulder: () => void;
}

export const BoulderBuilderContentMobile: React.FC<BoulderBuilderContentMobileProps> =
	watchDependencies((props: BoulderBuilderContentMobileProps) => {
		const boulder = props.boulder();
		const selectedTrack = props.selectedTrack();

		const [ModalDelete, showModalDelete] = useModal();

		const [trackTab, setTrackTab] = useState(true);

		return (
			<>
				{/* BOULDER IMAGE */}
				{props.full && (
					<div className="relative flex max-h-[40%] w-full overflow-hidden rounded-t-lg bg-dark">
						<ImageSlider
							images={boulder.images}
							currentImage={props.currentImage}
							setCurrentImage={props.setCurrentImage}
							tracks={boulder.tracks.quarks()}
							selectedTrack={props.selectedTrack}
						/>
					</div>
				)}

				<div className="flex h-[60%] flex-col">
					{/* BOULDER INFOS */}
					<div
						className={`grid grid-cols-8 items-center p-5 ${
							props.full ? "" : " mt-3"
						}`}
					>
						<div className="col-span-6">
							<div className="ktext-section-title">{boulder.name}</div>
							{boulder.isHighball && props.full && (
								<div className="ktext-base-little">High Ball</div>
							)}
							{boulder.dangerousDescent && props.full && (
								<div className="ktext-base-little">Descente dangereuse !</div>
							)}
							{!props.full && (
								<div className="mt-2 flex items-center">
									<GradeScale boulder={boulder} circleSize="little" />
								</div>
							)}
						</div>

						<div className="col-span-2 flex flex-col items-center justify-end gap-2">
							{props.full && (
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

							{!props.full && (
								<div className="relative h-[60px] w-full overflow-hidden rounded-sm">
									<Image
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
					{props.full && (
						<div className="ktext-label my-2 flex flex-row px-5 font-bold">
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
					{trackTab && props.full && (
						<div className="overflow-auto pb-[30px]">
							<TracksListBuilder
								boulder={props.boulder}
								selectedTrack={props.selectedTrack}
								onDrawButtonClick={() => props.setDisplayDrawer(true)}
								onTrackClick={(trackQuark) => {
									const newImageIndex = boulder.images.findIndex(
										(img) => img.id === trackQuark().lines?.at(0)?.imageId
									);
									if (props.selectedTrack()?.id === trackQuark().id)
										props.selectedTrack.select(undefined);
									else {
										if (newImageIndex > -1)
											props.setCurrentImage(boulder.images[newImageIndex]);
										props.selectedTrack.select(trackQuark);
									}
								}}
								onCreateTrack={() => props.setDisplayDrawer(true)}
							/>
						</div>
					)}

					{/* BOULDER FORM */}
					{!trackTab && props.full && (
						<div className="overflow-auto border-t border-grey-light px-6 py-10">
							<BoulderForm boulder={props.boulder} topo={props.topo} />
							<Button
								content="Supprimer le bloc"
								className="mt-10"
								fullWidth
								onClick={showModalDelete}
							/>
						</div>
					)}
				</div>

				<ModalDelete
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={() => {
						props.topo().boulders.removeQuark(props.boulder);
						props.onDeleteBoulder();
					}}
				>
					Etes-vous sûr de vouloir supprimer le bloc ainsi que toutes les voies associées ?
				</ModalDelete>
			</>
		);
	});

	BoulderBuilderContentMobile.displayName = "BoulderBuilderContentMobile";
