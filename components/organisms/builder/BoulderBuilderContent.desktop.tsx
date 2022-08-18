import React, { Dispatch, SetStateAction, useCallback, useRef } from "react";
import {
	BoulderPreviewDesktop,
	BoulderForm,
	Button,
} from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Img, Topo } from "types";
import { setReactRef } from "helpers/utils";
import { useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { deleteBoulder } from "helpers/builder";
import { TracksListBuilder } from "./TracksListBuilder";
import { SelectedBoulder, SelectedItem } from "types/SelectedItems";
import { BuilderSlideoverTrackDesktop } from "./BuilderSlideoverTrack.desktop";

interface BoulderBuilderContentDesktopProps {
	topo: Quark<Topo>;
	selectedBoulder: SelectedBoulder;
	setSelectedItem: Dispatch<SetStateAction<SelectedItem>>;
	onDeleteBoulder: () => void;
}

export const BoulderBuilderContentDesktop = watchDependencies<
	HTMLInputElement,
	BoulderBuilderContentDesktopProps
>((props: BoulderBuilderContentDesktopProps, parentRef) => {
	const [ModalDelete, showModalDelete] = useModal();
	const imageInputRef = useRef<HTMLInputElement>(null);	

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
					displayAddButton
					allowDelete
				/>

				<TracksListBuilder
					selectedBoulder={props.selectedBoulder}
					setSelectedItem={props.setSelectedItem}
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
