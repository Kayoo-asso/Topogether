import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useRef,
	useState,
} from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Img, Track, UUID } from "types";
import { MultipleImageInput, TracksImage } from ".";
import { deleteTrack } from "helpers/builder";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks/useModal";
import { setReactRef } from "helpers/utils";
import { SelectedBoulder, SelectedItem, selectImage } from "types/SelectedItems";

interface BoulderPreviewDesktopProps {
	selectedBoulder: SelectedBoulder;
	setSelectedItem: Dispatch<SetStateAction<SelectedItem>>;
	displayAddButton?: boolean;
	allowDelete?: boolean;
}

export const BoulderPreviewDesktop = watchDependencies<
	HTMLInputElement,
	BoulderPreviewDesktopProps
>(
	(
		{ displayAddButton = false, ...props }: BoulderPreviewDesktopProps,
		parentRef
	) => {
		const boulder = props.selectedBoulder.value();
		const multipleImageInputRef = useRef<HTMLInputElement>(null);

		const [loading, setLoading] = useState(false);

		const [ModalDeleteImage, showModalDeleteImage] =
			useModal<[Quark<Track>[], UUID]>();
		const deleteImage = useCallback(
			(id: UUID) => {
				if (props.selectedBoulder.selectedImage?.id === id) props.setSelectedItem({ ...props.selectedBoulder, selectedImage: undefined });
				const newImages = boulder.images.filter((img) => img.id !== id);
				props.selectedBoulder.value.set((b) => ({
					...b,
					images: newImages,
				}));
				if (newImages.length === 0) {
					deleteTracks(boulder.tracks.quarks().toArray());
					props.setSelectedItem({ ...props.selectedBoulder, selectedImage: undefined });
				}
			},
			[props.selectedBoulder, props.selectedBoulder.value()]
		);
		const deleteTracks = useCallback(
			(tracksQuark: Quark<Track>[]) => {
				tracksQuark.forEach((tQ) => 
					deleteTrack(boulder, tQ, props.setSelectedItem, props.selectedBoulder)
				);
			},
			[boulder, props.selectedBoulder, props.setSelectedItem]
		);

		const addImagesClick = useCallback(() => {
			if (!props.selectedBoulder.selectedImage && multipleImageInputRef.current) {
				multipleImageInputRef.current.click();
			}
		}, [props.selectedBoulder.selectedImage, loading]);

		return (
			<>
				<div className="mb-3 px-5">
					<div className="bg-dark">
						<TracksImage
							sizeHint="300px"
							image={props.selectedBoulder.selectedImage}
							tracks={boulder.tracks.quarks()}
							selectedBoulder={props.selectedBoulder}
							setSelectedItem={props.setSelectedItem}
							modalable={!!props.selectedBoulder.selectedImage}
							onImageClick={!loading ? addImagesClick : undefined}
						/>
					</div>

					<div className="mt-3 flex min-h-max w-full flex-col">
						<MultipleImageInput
							ref={(ref) => {
								setReactRef(multipleImageInputRef, ref);
								setReactRef(parentRef, ref);
							}}
							images={boulder.images}
							selectedBoulder={props.selectedBoulder}
							selected={props.selectedBoulder.selectedImage?.id}
							rows={1}
							onImageClick={useCallback(
								(id) => {
									selectImage(boulder.images.find((img) => img.id === id)!, props.setSelectedItem)
								},
								[props.selectedBoulder, boulder, props.setSelectedItem]
							)}
							allowUpload={displayAddButton}
							onChange={useCallback(
								(images) => {
									props.selectedBoulder.value.set((b) => ({
										...b,
										images: [...b.images, ...images],
									}));
									selectImage(images[0], props.setSelectedItem);
								},
								[props.selectedBoulder, boulder, props.setSelectedItem]
							)}
							onImageDelete={
								props.allowDelete
									? useCallback(
											(id) => {
												const tracksOnTheImage = boulder.tracks
													.quarks()
													.filter(
														(t) => !!t().lines?.find((l) => l.imageId === id)
													)
													.toArray();
												if (tracksOnTheImage.length > 0)
													showModalDeleteImage([tracksOnTheImage, id]);
												else deleteImage(id);
											},
											[boulder.tracks]
									  )
									: undefined
							}
							onLoadStart={() => setLoading(true)}
							onLoadEnd={() => setLoading(false)}
						/>
					</div>
				</div>

				<ModalDeleteImage
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={([trackQuarks, uuid]) => {
						deleteTracks(trackQuarks);
						deleteImage(uuid);
					}}
				>
					Tous les passages dessinés sur cette image seront supprimés. Etes-vous
					sûr de vouloir continuer ?
				</ModalDeleteImage>
			</>
		);
	}
);

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";
