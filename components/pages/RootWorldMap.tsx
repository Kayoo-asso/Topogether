import React, { useRef, useState } from "react";
import { HeaderDesktop } from "components/layouts/HeaderDesktop";
import { LeftbarDesktop } from "components/layouts/Leftbar.desktop";
import { watchDependencies } from "helpers/quarky";
import { useAuth } from "helpers/services";
import { LightTopo } from "types";
import { encodeUUID } from "helpers/utils";
import { MapControl } from "components/map/MapControl";
import { TopoMarkersLayer } from "components/map/markers/TopoMarkersLayer";
import { SlideoverMobileWorldmap } from "components/organisms/worldMap/Slideover.mobile.worldmap";
import { Map } from "ol";
import { SearchbarToposDesktop } from "components/map/searchbar/SearchbarTopos.desktop";
import { useToposFilters } from "components/map/filters/useToposFilters";
import { ToposFiltersDesktop } from "components/map/filters/ToposFilters.desktop";
import { downloads } from "helpers/downloads/DownloadManager";
import { usePosition } from "helpers/hooks/UserPositionProvider";
import { TopoPreview } from "components/organisms/TopoPreview";

interface RootWorldMapProps {
	lightTopos: LightTopo[];
}

export const RootWorldMap: React.FC<RootWorldMapProps> = watchDependencies(
	(props: RootWorldMapProps) => {
		const auth = useAuth();
		const user = auth.session();
		const { position } = usePosition();
		const mapRef = useRef<Map>(null);

		const [selectedTopo, setSelectedTopo] = useState<LightTopo>();

		const SearchbarDesktop: React.FC = () => <SearchbarToposDesktop map={mapRef.current} />
		const [Filters, filterTopos, resetFilters] = useToposFilters(props.lightTopos);
		const FiltersDesktop: React.FC = () => <ToposFiltersDesktop Filters={Filters} onResetClick={resetFilters} />;

		const onGoingDl = downloads.getGlobalState().ongoing;

		return (
			<>
				<HeaderDesktop
					backLink="#"
					title="Carte des topo"
					displayLogin={user ? false : true}
				>
					<div className={`${onGoingDl > 0 ? '' : 'hidden'} text-white ktext-label w-full flex justify-end`}>
						Téléchargement en cours... ({onGoingDl})
					</div>
				</HeaderDesktop>
				{onGoingDl > 0 && (
					<div className="flex h-header items-center bg-dark px-8">
						<div className={`${onGoingDl > 0 ? '' : 'hidden'} text-white ktext-label w-full flex justify-end`}>
							Téléchargement en cours... ({onGoingDl})
						</div>
					</div>
				)}

				<div className={`${onGoingDl > 0 ? 'h-content' : 'h-contentPlusHeader'} relative flex flex-row md:h-full`}>
					{user && <LeftbarDesktop currentMenuItem="MAP" />}

					<SlideoverMobileWorldmap 
						map={mapRef.current} 
						Filters={Filters}
						onFilterReset={resetFilters}
					/>

					<MapControl 
						ref={mapRef}
						initialZoom={5}
						initialCenter={position || undefined}
						displayUserMarker='under'
						// onUserMarkerClick={(e) => console.log(e)}
						Searchbar={SearchbarDesktop}
						Filters={FiltersDesktop}
						onClick={(e) => {
							const map = e.map;
							const hit = map?.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
								return true;
							});
							if (!hit) setSelectedTopo(undefined);
						}}
					>
						<TopoMarkersLayer 
							topos={props.lightTopos.filter(filterTopos)}
							selectedTopo={selectedTopo}
							onTopoSelect={t => setSelectedTopo(t as LightTopo)}
						/>
					</MapControl>

						{selectedTopo &&	
							<TopoPreview
								topo={selectedTopo}
								displayLikeDownload={!!user}
								// displayCreator
								displayParking
								mainButton={{ content: 'Entrer', link: '/topo/' + encodeUUID(selectedTopo.id) }}
								onClose={() => setSelectedTopo(undefined)}
							/>
						}
				</div>
			</>
		);
	}
);
