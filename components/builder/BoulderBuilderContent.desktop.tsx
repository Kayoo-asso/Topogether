import React, { Dispatch, SetStateAction, useCallback, useRef } from "react";
import {
	BoulderPreviewDesktop,
	BoulderForm,
	Button,
} from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, Img, Topo } from "types";
import { TracksListBuilder } from ".";
import { setReactRef } from "helpers/utils";
import { useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { ItemType, SelectedBoulder } from "components/organisms/builder/Slideover.right.builder";
import { deleteBoulder } from "helpers/builder";

interface BoulderBuilderContentDesktopProps {
	topo: Quark<Topo>;
	selectedBoulder: SelectedBoulder;
	setSelectedItem: Dispatch<SetStateAction<ItemType>>;
	currentImage?: Img;
	setCurrentImage: Dispatch<SetStateAction<Img | undefined>>;
	onDeleteBoulder: () => void;
}

export const BoulderBuilderContentDesktop = watchDependencies<
	HTMLInputElement,
	BoulderBuilderContentDesktopProps
>((props: BoulderBuilderContentDesktopProps, parentRef) => {
	const boulder = props.selectedBoulder.value();

	const [ModalDelete, showModalDelete] = useModal();

	const imageInputRef = useRef<HTMLInputElement>(null);

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
					props.setCurrentImage(newImage);
				}
				props.setSelectedItem({ ...props.selectedBoulder, selectedTrack: trackQuark });
			}
		},
		[props.selectedBoulder, props.selectedBoulder.selectedTrack, props.setSelectedItem, props.setCurrentImage, boulder]
	);

	return (
		<>
			{/* overflow-scroll to avoid scrollbar glitches with certain image sizes, where hovering the ImageThumb would display the scrolbar & change the overall layout*/}
			<div className="flex h-full w-full flex-col overflow-scroll">
				<BoulderForm
					className="mt-3 mb-6 px-5"
					boulder={props.selectedBoulder.value}
					topo={props.topo}
				/>

				<BoulderPreviewDesktop
					ref={(ref) => {
						setReactRef(imageInputRef, ref);
						setReactRef(parentRef, ref);
					}}
					selectedBoulder={props.selectedBoulder}
					setSelectedItem={props.setSelectedItem}
					currentImage={props.currentImage}
					displayAddButton
					allowDelete
					setCurrentImage={props.setCurrentImage}
				/>

				<TracksListBuilder
					boulder={props.selectedBoulder.value}
					selectedBoulder={props.selectedBoulder}
					setSelectedItem={props.setSelectedItem}
					onTrackClick={toggleSelectedTrack}
					onAddImage={useCallback(
						() => imageInputRef.current && imageInputRef.current.click(),
						[]
					)}
				/>

				<div className="my-6 px-4">
					<Button
						content="Supprimer"
						onClick={showModalDelete}
						fullWidth
					/>
				</div>
				
			</div>

			<ModalDelete
				buttonText="Confirmer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={() => {
					deleteBoulder(props.topo, props.selectedBoulder.value, props.setSelectedItem, props.selectedBoulder);
					props.onDeleteBoulder();
				}}
			>
				Etes-vous sûr de vouloir supprimer le bloc ainsi que toutes les voies associées ?
		</ModalDelete>
		</>
	);
});

BoulderBuilderContentDesktop.displayName = "BoulderBuilderContentDesktop";
