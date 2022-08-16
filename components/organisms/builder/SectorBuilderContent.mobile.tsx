import React, { Dispatch, SetStateAction } from "react";
import { Button } from "components";
import { Boulder, Sector, Topo, Track, UUID } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { SectorListBuilder } from "./SectorListBuilder";
import { SelectedBoulder, SelectedItem } from "types/SelectedItems";

interface SectorBuilderContentMobileProps {
	topo: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder: SelectedBoulder;
	setSelectedItem: Dispatch<SetStateAction<SelectedItem>>;
	onCreateSector: () => void;
	onBoulderSelect: (boulderQuark: Quark<Boulder>) => void;
	onTrackSelect: (
		trackQuark: Quark<Track>,
		boulderQuark: Quark<Boulder>
	) => void;
	onRenameSector: (sectorQuark: Quark<Sector>) => void;
	onDeleteBoulder: (boulderQuark: Quark<Boulder>) => void;
	onClose: () => void;
}

export const SectorBuilderContentMobile: React.FC<SectorBuilderContentMobileProps> =
	watchDependencies((props: SectorBuilderContentMobileProps) => {
		return (
				<div className="mt-10 flex flex-col overflow-auto px-3 pb-5">
					<SectorListBuilder
						topoQuark={props.topo}
						boulderOrder={props.boulderOrder}
						selectedBoulder={props.selectedBoulder}
						setSelectedItem={props.setSelectedItem}
						onBoulderSelect={props.onBoulderSelect}
						onTrackSelect={props.onTrackSelect}
					/>

					<div className="flex w-full flex-col items-center">
						<Button
							content="Nouveau secteur"
							className="w-3/4"
							onClick={() => {
								props.onCreateSector();
								props.onClose();
							}}
						/>
					</div>
				</div>
		);
	});

	SectorBuilderContentMobile.displayName = "SectorBuilderContentMobile";
