import React, {
	useCallback,
	useRef,
	useState,
} from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Track, UUID } from "types";
import { MultipleImageInput, TracksImage } from ".";
import { deleteTrack } from "helpers/builder";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks/useModal";
import { setReactRef } from "helpers/utils";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";

interface BoulderPreviewDesktopProps {
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
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const boulder = selectedBoulder.value();
		const selectedImage = selectedBoulder.selectedImage;
		const select = useSelectStore(s => s.select);
		const flush = useSelectStore(s => s.flush);

		const multipleImageInputRef = useRef<HTMLInputElement>(null);

		const [loading, setLoading] = useState(false);

		const deleteTracks = useCallback(
			(tracksQuark: Quark<Track>[]) => {
				tracksQuark.forEach((tQ) => 
					deleteTrack(boulder, tQ, flush.track, selectedBoulder)
				);
			},
			[boulder, selectedBoulder, flush.track]
		);

		const [ModalDeleteImage, showModalDeleteImage] = useModal<[Quark<Track>[], UUID]>();
		const deleteImage = useCallback(
			(id: UUID) => {
				const imgIndex = boulder.images.indexOf(boulder.images.find(img => img.id === id)!);
				const newImages = boulder.images.filter((img) => img.id !== id);
				if (newImages.length === 0) {
					deleteTracks(boulder.tracks.quarks().toArray());
					flush.image();
				}
				//Select the image that come just after (or just before if it was the last one)
				else if (selectedImage?.id === id) {
					if (imgIndex === -1) flush.image();
					else if (imgIndex < newImages.length) select.image(newImages[imgIndex]);
					else select.image(newImages[newImages.length - 1]);
				}
				selectedBoulder.value.set((b) => ({
					...b,
					images: newImages,
				}));
			},
			[selectedBoulder.value, selectedImage, boulder.images, flush.image, select.image, deleteTracks]
		);

		const addImagesClick = useCallback(() => {
			if (!selectedImage && multipleImageInputRef.current) {
				multipleImageInputRef.current.click();
			}
		}, [selectedImage, loading]);

		return (
			<>
				<div className="mb-3 px-5">
					<div className="bg-dark">
						<TracksImage
							sizeHint="300px"
							image={selectedBoulder.selectedImage}
							tracks={boulder.tracks.quarks()}
							modalable={!!selectedBoulder.selectedImage}
							onImageClick={!loading ? addImagesClick : undefined}
						/>
					</div>

					<div className="mt-3 flex min-h-max w-full flex-col">
						<MultipleImageInput
							ref={useCallback((ref) => {
								setReactRef(multipleImageInputRef, ref);
								setReactRef(parentRef, ref);
							}, [parentRef, multipleImageInputRef])}
							images={boulder.images}
							selected={selectedBoulder.selectedImage?.id}
							rows={1}
							onImageClick={useCallback(
								(id) => {
									select.image(boulder.images.find((img) => img.id === id)!)
								},
								[select.image, boulder.images]
							)}
							allowUpload={displayAddButton}
							onChange={useCallback(
								(images) => {
									selectedBoulder.value.set((b) => ({
										...b,
										images: [...b.images, ...images],
									}));
									select.image(images[0]);
								},
								[selectedBoulder.value, select.image]
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
											[boulder.tracks, deleteImage, props.allowDelete]
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
					onConfirm={useCallback(([trackQuarks, uuid]) => {
						deleteTracks(trackQuarks);
						deleteImage(uuid);
					}, [deleteTracks, deleteImage, boulder.images])}
				>
					Tous les passages dessinés sur cette image seront supprimés. Etes-vous
					sûr de vouloir continuer ?
				</ModalDeleteImage>
			</>
		);
	}
);

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";
