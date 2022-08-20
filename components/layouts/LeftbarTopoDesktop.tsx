import React from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo, UUID } from "types";
import { SectorList } from "components";

interface LeftbarTopoDesktopProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	map: google.maps.Map | null;
}

export const LeftbarTopoDesktop: React.FC<LeftbarTopoDesktopProps> =
	watchDependencies((props: LeftbarTopoDesktopProps) => {
		return (
			<div className="z-500 hidden h-full w-[280px] min-w-[280px] flex-col overflow-auto border-r border-grey-medium bg-white px-2 py-10 md:flex">
				<SectorList
					topoQuark={props.topoQuark}
					boulderOrder={props.boulderOrder}
					map={props.map}
				/>
			</div>
		);
	});

LeftbarTopoDesktop.displayName = "Leftbar Topo Desktop";
