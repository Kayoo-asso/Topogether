import React, { useCallback, useRef } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo } from "types";
import { setReactRef } from "helpers/utils";
import { TracksListBuilder } from "./TracksListBuilder";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";
import { BoulderForm } from "../form/BoulderForm";
import { BoulderPreviewDesktop } from "components/molecules/BoulderPreview.desktop";
import { Button } from "components/atoms/buttons/Button";
import { useDeleteStore } from "components/pages/deleteStore";
import { ItemsHeaderButtons } from "../ItemsHeaderButtons";

interface BoulderBuilderContentDesktopProps {
	topo: Quark<Topo>;
}

export const BoulderBuilderContentDesktop = watchDependencies<
	HTMLInputElement,
	BoulderBuilderContentDesktopProps
>((props: BoulderBuilderContentDesktopProps, parentRef) => {
	const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
	const boulder = selectedBoulder.value();
	const flush = useSelectStore(s => s.flush);
	const del = useDeleteStore(d => d.delete);

	const imageInputRef = useRef<HTMLInputElement>(null);	

	return (
		// overflow-scroll to avoid scrollbar glitches with certain image sizes, where hovering the ImageThumb would display the scrolbar & change the overall layout
		<div className="flex h-full w-full flex-col overflow-scroll">
			
			<ItemsHeaderButtons item={boulder} onClose={flush.item} />

			<BoulderForm
				className="mt-20 mb-6 px-5"
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
					onClick={() => del.item(selectedBoulder)}
					fullWidth
				/>
			</div>
		</div>
	);
});

BoulderBuilderContentDesktop.displayName = "BoulderBuilderContentDesktop";
