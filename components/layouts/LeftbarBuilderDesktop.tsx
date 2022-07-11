import React from "react";
import { Button } from "components";
import { Quark, SelectQuarkNullable, watchDependencies } from "helpers/quarky";
import { Boulder, Sector, Topo, Track, UUID } from "types";
import { SectorListBuilder } from "components/builder";

interface LeftbarBuilderDesktopProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder: SelectQuarkNullable<Boulder>;
	onBoulderSelect: (boulderQuark: Quark<Boulder>) => void;
	onTrackSelect: (
		trackQuark: Quark<Track>,
		boulderQuark: Quark<Boulder>
	) => void;
	activateSubmission: boolean;
	onSubmit: () => void;
	onRenameSector: (sectorQuark: Quark<Sector>) => void;
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
					onBoulderSelect={props.onBoulderSelect}
					onTrackSelect={props.onTrackSelect}
					onRenameSector={props.onRenameSector}
					onDeleteBoulder={props.onDeleteBoulder}
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
