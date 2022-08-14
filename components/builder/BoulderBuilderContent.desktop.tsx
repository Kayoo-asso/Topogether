import React, { Dispatch, SetStateAction, useCallback, useRef } from "react";
import {
	BoulderPreviewDesktop,
	BoulderForm,
	Button,
} from "components";
import { Quark, SelectQuarkNullable, watchDependencies } from "helpers/quarky";
import { Boulder, Img, Topo, Track } from "types";
import { TracksListBuilder } from ".";
import { setReactRef } from "helpers/utils";
import { useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";

interface BoulderBuilderContentDesktopProps {
	boulder: Quark<Boulder>;
	topo: Quark<Topo>;
	selectedTrack: SelectQuarkNullable<Track>;
	currentImage?: Img;
	setCurrentImage: Dispatch<SetStateAction<Img | undefined>>;
	onDeleteBoulder: () => void;
}

export const BoulderBuilderContentDesktop = watchDependencies<
	HTMLInputElement,
	BoulderBuilderContentDesktopProps
>((props: BoulderBuilderContentDesktopProps, parentRef) => {
	const boulder = props.boulder();

	const [ModalDelete, showModalDelete] = useModal();

	const imageInputRef = useRef<HTMLInputElement>(null);

	const toggleSelectedTrack = useCallback(
		(trackQuark) => {
			const track = trackQuark();
			if (props.selectedTrack()?.id === track.id)
				props.selectedTrack.select(undefined);
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
				props.selectedTrack.select(trackQuark);
			}
		},
		[props.selectedTrack(), boulder]
	);

	return (
		<>
			{/* overflow-scroll to avoid scrollbar glitches with certain image sizes, where hovering the ImageThumb would display the scrolbar & change the overall layout*/}
			<div className="flex h-full w-full flex-col overflow-scroll">
				<BoulderForm
					className="mt-3 mb-6 px-5"
					boulder={props.boulder}
					topo={props.topo}
				/>

				<BoulderPreviewDesktop
					ref={(ref) => {
						setReactRef(imageInputRef, ref);
						setReactRef(parentRef, ref);
					}}
					boulder={props.boulder}
					selectedTrack={props.selectedTrack}
					currentImage={props.currentImage}
					displayAddButton
					allowDelete
					setCurrentImage={props.setCurrentImage}
				/>

				<TracksListBuilder
					boulder={props.boulder}
					selectedTrack={props.selectedTrack}
					onTrackClick={toggleSelectedTrack}
					onAddImage={useCallback(
						() => imageInputRef.current && imageInputRef.current.click(),
						[]
					)}
				/>

				<Button
					content="Supprimer"
					onClick={showModalDelete}
					fullWidth
				/>
				
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

BoulderBuilderContentDesktop.displayName = "BoulderBuilderContentDesktop";
