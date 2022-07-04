import React from "react";
import { Button, SlideoverMobile } from "components";
import { Boulder, Sector, Topo, Track, UUID } from "types";
import { Quark, watchDependencies, SelectQuarkNullable } from "helpers/quarky";
import { SectorListBuilder } from "./SectorListBuilder";

interface SectorBuilderSlideoverMobileProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder: SelectQuarkNullable<Boulder>;
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

export const SectorBuilderSlideoverMobile: React.FC<SectorBuilderSlideoverMobileProps> =
	watchDependencies((props: SectorBuilderSlideoverMobileProps) => {
		return (
			<SlideoverMobile onClose={props.onClose}>
				<div className="mt-10 flex flex-col overflow-auto px-3 pb-5">
					<SectorListBuilder
						topoQuark={props.topoQuark}
						boulderOrder={props.boulderOrder}
						selectedBoulder={props.selectedBoulder}
						onBoulderSelect={props.onBoulderSelect}
						onTrackSelect={props.onTrackSelect}
						onRenameSector={props.onRenameSector}
						onDeleteBoulder={props.onDeleteBoulder}
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
			</SlideoverMobile>
		);
	});

SectorBuilderSlideoverMobile.displayName = "SectorBuilderSlideoverMobile";
