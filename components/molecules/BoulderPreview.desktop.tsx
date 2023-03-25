import React, {
	useCallback,
	useRef,
	useState,
} from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Track, UUID } from "types";
import { deleteTrack } from "helpers/builder";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks/useModal";
import { setReactRef } from "helpers/utils";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { TracksImage } from "./TracksImage";
import { MultipleImageInput } from "./form/MultipleImageInput";
import { useDrawerStore } from "components/store/drawerStore";

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
		const openDrawer = useDrawerStore(d => d.openDrawer);

		const multipleImageInputRef = useRef<HTMLInputElement>(null);

		const [loading, setLoading] = useState(false);

		const addImagesClick = useCallback(() => {
			if (selectedImage) {
				const tracksOnTheImage = boulder.tracks.quarks().filter(t => t().lines.at(0).imageId === selectedImage.id).toArray();
				const firstTrack = tracksOnTheImage.reduce((min, curr) => (curr().index < min().index ? curr : min), tracksOnTheImage[0]);
				if (firstTrack) {
					select.track(firstTrack);
					openDrawer();
				}
			}
			else if (multipleImageInputRef.current) {
				multipleImageInputRef.current.click();
			}
		}, [selectedImage, loading]);

		return (
			<div className="flex flex-col gap-6">
				<div className='ktext-label font-semibold px-5'>Ajout des voies</div>

				<div className="mb-3">
					<div className="bg-dark">
						<TracksImage
							sizeHint="300px"
							image={selectedBoulder.selectedImage}
							tracks={boulder.tracks.quarks()}
							onImageClick={!loading ? addImagesClick : undefined}
						/>
					</div>

					<div className="mt-3 flex min-h-max w-full flex-col px-5">
						<MultipleImageInput
							ref={useCallback((ref) => {
								setReactRef(multipleImageInputRef, ref);
								setReactRef(parentRef, ref);
							}, [parentRef, multipleImageInputRef])}
							images={boulder.images}
							selected={selectedBoulder.selectedImage}
							rows={1}
							allowUpload={displayAddButton}
							allowDelete={props.allowDelete}
							onChange={(images) => {
								selectedBoulder.value.set((b) => ({
									...b,
									images: [...b.images, ...images],
								}));
								select.image(images[0]);
							}}
							onLoadStart={() => setLoading(true)}
							onLoadEnd={() => setLoading(false)}
						/>
					</div>
				</div>
			</div>
		);
	}
);

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";
