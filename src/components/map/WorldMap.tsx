import FilterIcon from "assets/icons/filter.svg";
import { RoundButton } from "~/components/buttons/RoundButton";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { LightTopo } from "~/server/queries";
import { useWorldMapStore } from "~/stores/worldmapStore";
import {
	TopoFiltersDesktop,
	filterTopos,
} from "~/components/forms/TopoFilters";
import { BaseMap } from "./BaseMap";
import { TopoInteractions, TopoMarkers } from "./TopoMarkers";
import { UserMarker } from "./UserMarker";

interface WorldMapProps {
	topos: LightTopo[];
}

export function WorldMap({ topos }: WorldMapProps) {
	const { position } = usePosition();
	const selectTopo = useWorldMapStore((s) => s.selectTopo);
	const filters = useWorldMapStore((s) => s.filters);
	const filteredTopos = filterTopos(topos, filters);

	return (
		<BaseMap
			initialCenter={position}
			initialZoom={5}
			onBackgroundClick={() => selectTopo(undefined)}
		>
			<WorldMapControls topos={topos} />
			<UserMarker />
			<TopoMarkers topos={filteredTopos} />
			<TopoInteractions />
		</BaseMap>
	);
}

function WorldMapControls({ topos }: { topos: LightTopo[] }) {
	const filtersOpen = useWorldMapStore((s) => s.filtersOpen);
	const toggleFilters = useWorldMapStore((s) => s.toggleFilters);

	return (
		<>
			{/* Top left */}
			<div className="absolute left-0 top-0 m-3 w-full space-y-5">
				{/* {Searchbar &&
							<div className={`relative hidden md:block`}>
								<SearchButton />
								<Searchbar />
							</div>
						} */}
				{/* TopoFilters */}
				<div className="relative hidden md:block">
					{!filtersOpen && (
						<RoundButton className="z-20" onClick={toggleFilters}>
							<FilterIcon className="h-6 w-6 fill-main stroke-main" />
						</RoundButton>
					)}
					{filtersOpen && <TopoFiltersDesktop topos={topos} />}
				</div>
			</div>
		</>
	);
}
