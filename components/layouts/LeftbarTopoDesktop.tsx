import React from "react";
import { Quark, SelectQuarkNullable, watchDependencies } from "helpers/quarky";
import { Boulder, Topo, Track, UUID } from "types";
import { SectorList } from "components";

interface LeftbarTopoDesktopProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder: SelectQuarkNullable<Boulder>;
	onBoulderSelect: (boulderQuark: Quark<Boulder>) => void;
	onTrackSelect: (
		trackQuark: Quark<Track>,
		boulderQuark: Quark<Boulder>
	) => void;
}

export const LeftbarTopoDesktop: React.FC<LeftbarTopoDesktopProps> =
	watchDependencies((props: LeftbarTopoDesktopProps) => {
		return (
			<div className="z-500 hidden h-full w-[280px] min-w-[280px] flex-col overflow-auto border-r border-grey-medium bg-white px-2 py-10 md:flex">
				<SectorList
					topoQuark={props.topoQuark}
					boulderOrder={props.boulderOrder}
					selectedBoulder={props.selectedBoulder}
					onBoulderSelect={props.onBoulderSelect}
					onTrackSelect={props.onTrackSelect}
				/>
			</div>
		);
	});

LeftbarTopoDesktop.displayName = "Leftbar Topo Desktop";
