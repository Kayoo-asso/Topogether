import FilterIcon from "assets/icons/filter.svg";
import { RoundButton } from "~/components/buttons/RoundButton";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { useWorldMapStore } from "~/stores/worldmapStore";
import { LightTopo } from "~/types";
import { HeaderDesktop } from "../layout/HeaderDesktop";
import { LeftbarDesktop } from "../layout/LeftbarDesktop";
import { TopoPreview } from "../previews/TopoPreview";
import { BaseMap } from "./BaseMap";
import { TopoFiltersDesktop, filterTopos } from "./TopoFilters";
import { TopoInteractions, TopoMarkers } from "./TopoMarkers";
import { TopoSearchbar } from "./TopoSearchbar";
import { UserMarker } from "./UserMarker";

interface WorldMapProps {
	topos: LightTopo[];
}

export function WorldMapDesktop({ topos }: WorldMapProps) {
	const { position } = usePosition();
	const filters = useWorldMapStore((s) => s.filters);
	const filteredTopos = filterTopos(topos, filters);

	// TODO
	const ongoingDl = 0;

	return (
		<>
			<HeaderDesktop backLink="#" title="Carte des topo">
				<div
					className={`${
						ongoingDl > 0 ? "" : "hidden"
					} ktext-label flex w-full justify-end text-white`}
				>
					Téléchargement en cours... ({ongoingDl})
				</div>
			</HeaderDesktop>
			<div className="relative flex h-full flex-row">
				<LeftbarDesktop currentMenuItem="MAP" />
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
				<TopoPreview sendTo="topo" displayLikeDownload displayParking />
			</div>
		</>
	);
}

function WorldMapControls({ topos }: { topos: LightTopo[] }) {
	const filtersOpen = useWorldMapStore((s) => s.filtersOpen);
	const toggleFilters = useWorldMapStore((s) => s.toggleFilters);

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
