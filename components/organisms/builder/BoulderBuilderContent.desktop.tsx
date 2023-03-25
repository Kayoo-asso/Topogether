import React, { useCallback, useRef } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo } from "types";
import { setReactRef } from "helpers/utils";
import { TracksListBuilder } from "./TracksListBuilder";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { RockForm } from "../form/RockForm";
import { BoulderPreviewDesktop } from "components/molecules/BoulderPreview.desktop";
import { Button } from "components/atoms/buttons/Button";
import { useDeleteStore } from "components/store/deleteStore";
import { ItemsHeaderButtons } from "../ItemsHeaderButtons";
import { useBoulderOrder } from "components/store/boulderOrderStore";

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

	const boulderOrder = useBoulderOrder(bo => bo.value);

	const imageInputRef = useRef<HTMLInputElement>(null);	

	return (
		// overflow-scroll to avoid scrollbar glitches with certain image sizes, where hovering the ImageThumb would display the scrolbar & change the overall layout
		<div className="flex h-full w-full flex-col overflow-scroll">
			
			<ItemsHeaderButtons item={boulder} builder onClose={flush.item} />
			<div className="ktext-base-superbig px-5 mt-3 mb-6">Bloc {boulderOrder.get(boulder.id)}</div>

			<RockForm
				className="mb-8 px-5"
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
