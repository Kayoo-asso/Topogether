import React, { Dispatch, SetStateAction } from "react";
import { Button } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, Topo, Track, UUID } from "types";
import { SectorListBuilder } from "components/builder";
import { ItemType, SelectedBoulder } from "components/organisms/builder/Slideover.right.builder";

interface LeftbarBuilderDesktopProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder?: SelectedBoulder;
	setSelectedItem: Dispatch<SetStateAction<ItemType>>;
	onBoulderSelect: (boulderQuark: Quark<Boulder>) => void;
	onTrackSelect: (
		trackQuark: Quark<Track>,
		boulderQuark: Quark<Boulder>
	) => void;
	activateSubmission: boolean;
	onSubmit: () => void;
	onDeleteBoulder: (boulderQuark: Quark<Boulder>) => void;
}

export const LeftbarBuilderDesktop: React.FC<LeftbarBuilderDesktopProps> =
	watchDependencies((props: LeftbarBuilderDesktopProps) => {
		return (
			<div className="z-500 hidden h-full w-[280px] min-w-[280px] flex-col overflow-auto border-r border-grey-medium bg-white px-2 py-10 md:flex">
				<SectorListBuilder
					topoQuark={props.topoQuark}
					boulderOrder={props.boulderOrder}
					selectedBoulder={props.selectedBoulder}
					setSelectedItem={props.setSelectedItem}
					onBoulderSelect={props.onBoulderSelect}
					onTrackSelect={props.onTrackSelect}
				/>

				<div className="px-6 text-center">
					<Button
						content="Valider le topo"
						onClick={props.onSubmit}
						fullWidth
					/>
				</div>
			</div>
		);
	});

LeftbarBuilderDesktop.displayName = "LeftbarBuilderDesktop";
