import { RoundButton } from "~/components/buttons/RoundButton";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { LightTopo } from "~/server/queries";
import { useWorldMapStore } from "~/stores/worldmapStore";
import { BaseMap } from "./BaseMap";
import { TopoFiltersDesktop, filterTopos } from "./TopoFilters";
import { TopoInteractions, TopoMarkers } from "./TopoMarkers";
import { UserMarker } from "./UserMarker";

import FilterIcon from "assets/icons/filter.svg";
import { TopoSearchbar } from "./TopoSearchbar";

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
			onBackgroundClick={() => {
				useWorldMapStore.setState({
					selectedTopo: undefined,
					filtersOpen: false,
					searchOpen: false,
				});
			}}
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
	const searchOpen = useWorldMapStore((s) => s.searchOpen);
	const toggleFilters = useWorldMapStore((s) => s.toggleFilters);
	const toggleSearch = useWorldMapStore((s) => s.toggleSearch);

	return (
		<>
			{/* Top left */}
			<div className="absolute left-0 top-0 m-3 w-full space-y-5">
				{/* Search */}
				<TopoSearchbar topos={topos} />
				{/* Filters */}
				<div className="hidden md:block">
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
