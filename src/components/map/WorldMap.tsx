import FilterIcon from "assets/icons/filter.svg";
import { RoundButton } from "~/components/buttons/RoundButton";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { useWorldMapStore } from "~/stores/worldmapStore";
import { LightTopo } from "~/types";
import { HeaderDesktop } from "../layout/HeaderDesktop";
import { WorldMapLeftbar } from "../layout/WorldMapLeftbar";
import { TopoPreview } from "../previews/TopoPreview";
import { BaseMap } from "./BaseMap";
import {
	TopoFiltersDesktop,
	TopoFiltersMobile,
	filterTopos,
} from "./TopoFilters";
import { TopoInteractions, TopoMarkers } from "./TopoMarkers";
import { TopoSearchDesktop, TopoSearchMobile } from "./TopoSearch";
import { UserMarker } from "./UserMarker";
import { useUser } from "@clerk/nextjs";

import SearchIcon from "assets/icons/search.svg";
import { SlideoverMobile } from "../layout/SlideoverMobile";

interface WorldMapProps {
	topos: LightTopo[];
}

export function WorldMapDesktop({ topos }: WorldMapProps) {
	const { position } = usePosition();
	const filters = useWorldMapStore((s) => s.filters);
	const filteredTopos = filterTopos(topos, filters);
	const { user } = useUser();
	// TODO
	const ongoingDl = 0;

	return (
		<>
			<HeaderDesktop backLink="#" title="Carte des topo">
				{ongoingDl > 0 && (
					<div className="ktext-label flex w-full justify-end text-white">
						Téléchargement en cours... ({ongoingDl})
					</div>
				)}
			</HeaderDesktop>
			<div className="flex h-contentPlusShell flex-row">
				{user && <WorldMapLeftbar currentMenuItem="MAP" />}
				<BaseMap
					initialCenter={position}
					initialZoom={5}
					TopLeft={<MapControlsDesktop topos={topos} />}
					onBackgroundClick={() => {
						useWorldMapStore.setState({
							filtersOpen: false,
							searchOpen: false,
						});
					}}
				>
					<UserMarker />
					<TopoMarkers topos={filteredTopos} />
					<TopoInteractions />
				</BaseMap>
				<TopoPreview sendTo="topo" displayLikeDownload displayParking />
			</div>
		</>
	);
}

export function WorldMapMobile({ topos }: WorldMapProps) {
	const filters = useWorldMapStore((s) => s.filters);
	const filteredTopos = filterTopos(topos, filters);
	const filtersOpen = useWorldMapStore((s) => s.filtersOpen);
	const searchOpen = useWorldMapStore((s) => s.searchOpen);
	const { position } = usePosition();
	// TODO:
	const ongoingDl = 0;
	return (
		<>
			{ongoingDl > 0 && (
				<div className="flex h-header items-center bg-dark px-8">
					<div className="ktext-label flex w-full justify-end text-white">
						Téléchargement en cours... ({ongoingDl})
					</div>
				</div>
			)}
			<div className={ongoingDl > 0 ? "h-content" : "h-contentPlusHeader"}>
				<BaseMap
					initialCenter={position}
					initialZoom={5}
					BottomRight={<MapControlsMobile />}
					onBackgroundClick={() => {
						useWorldMapStore.setState({
							filtersOpen: false,
							searchOpen: false,
						});
					}}
				>
					<UserMarker />
					<TopoMarkers topos={filteredTopos} />
					<TopoInteractions />
					<SlideoverMobile open={filtersOpen || searchOpen}>
						{searchOpen && <TopoSearchMobile topos={topos} />}
						{filtersOpen && <TopoFiltersMobile topos={topos} />}
					</SlideoverMobile>
				</BaseMap>
			</div>
		</>
	);
}

function MapControlsDesktop({ topos }: WorldMapProps) {
	const filtersOpen = useWorldMapStore((s) => s.filtersOpen);
	const toggleFilters = useWorldMapStore((s) => s.toggleFilters);

	return (
		<>
			{/* Search */}
			<TopoSearchDesktop topos={topos} />
			{/* Filters */}
			{!filtersOpen && (
				<RoundButton className="z-20" onClick={toggleFilters}>
					<FilterIcon className="h-6 w-6 fill-main stroke-main" />
				</RoundButton>
			)}
			{filtersOpen && <TopoFiltersDesktop topos={topos} />}
		</>
	);
}

function MapControlsMobile() {
	const toggleFilters = useWorldMapStore((s) => s.toggleFilters);
	const toggleSearch = useWorldMapStore((s) => s.toggleSearch);

	return (
		<>
			<RoundButton onClick={toggleSearch}>
				<SearchIcon className="h-6 w-6 stroke-main" />
			</RoundButton>
			<RoundButton onClick={toggleFilters}>
				<FilterIcon className="h-6 w-6 fill-main stroke-main" />
			</RoundButton>
		</>
	);
}
