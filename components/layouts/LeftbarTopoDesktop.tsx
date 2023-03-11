import React from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo, UUID } from "types";
import { Map } from "ol";
import { SectorList } from "components/molecules/SectorList";

interface LeftbarTopoDesktopProps {
	topoQuark: Quark<Topo>;
	map: Map | null;
}

export const LeftbarTopoDesktop: React.FC<LeftbarTopoDesktopProps> =
	watchDependencies((props: LeftbarTopoDesktopProps) => {
		return (
			<div className="z-500 hidden h-full w-[280px] min-w-[280px] flex-col overflow-auto border-r border-grey-medium bg-white px-2 py-10 md:flex">
				<SectorList
					topoQuark={props.topoQuark}
					map={props.map}
				/>
			</div>
		);
	});

LeftbarTopoDesktop.displayName = "Leftbar Topo Desktop";
