import React, { useCallback, useRef } from "react";
import {
	BoulderPreviewDesktop,
	BoulderForm,
	Button,
} from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo } from "types";
import { setReactRef } from "helpers/utils";
import { useBreakpoint, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { deleteBoulder } from "helpers/builder";
import { TracksListBuilder } from "./TracksListBuilder";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";

interface BoulderBuilderContentDesktopProps {
	topo: Quark<Topo>;
}

export const BoulderBuilderContentDesktop = watchDependencies<
	HTMLInputElement,
	BoulderBuilderContentDesktopProps
>((props: BoulderBuilderContentDesktopProps, parentRef) => {
	const breakpoint = useBreakpoint();
	const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
	const flush = useSelectStore(s => s.flush);

	const [ModalDelete, showModalDelete] = useModal();
	const imageInputRef = useRef<HTMLInputElement>(null);	

	return (
		<>
			{/* overflow-scroll to avoid scrollbar glitches with certain image sizes, where hovering the ImageThumb would display the scrolbar & change the overall layout*/}
			<div className="flex h-full w-full flex-col overflow-scroll">
				<BoulderForm
					className="mt-3 mb-6 px-5"
					topo={props.topo}
				/>

				<BoulderPreviewDesktop
					ref={useCallback((ref) => {
						setReactRef(imageInputRef, ref);
						setReactRef(parentRef, ref);
					}, [imageInputRef, parentRef])}
					displayAddButton
					allowDelete
				/>

				<TracksListBuilder
					onAddImage={() => imageInputRef.current && imageInputRef.current.click()}
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
				onConfirm={useCallback(() => {
					const flushAction = breakpoint === 'mobile' ? flush.all : flush.item;
					deleteBoulder(props.topo, selectedBoulder.value, flushAction, selectedBoulder);
				}, [breakpoint, flush.all, flush.item, props.topo, selectedBoulder, selectedBoulder.value])}
			>
				Etes-vous sûr de vouloir supprimer le bloc ainsi que toutes les voies associées ?
		</ModalDelete>
		</>
	);
});

BoulderBuilderContentDesktop.displayName = "BoulderBuilderContentDesktop";
