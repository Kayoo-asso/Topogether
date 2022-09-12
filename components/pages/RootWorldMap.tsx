import React, { useState } from "react";
import { HeaderDesktop } from "components/layouts/HeaderDesktop";
import { LeftbarDesktop } from "components/layouts/Leftbar.desktop";
import { TopoFilterOptions, MapControl, TopoMarker } from "../map";
import { hasFlag } from "helpers/bitflags";
import { watchDependencies, useCreateQuark } from "helpers/quarky";
import { useAuth } from "helpers/services";
import { LightTopo, Amenities, TopoTypes } from "types";
import { encodeUUID } from "helpers/utils";
import { TopoPreview } from "components/organisms/TopoPreview";

interface RootWorldMapProps {
	lightTopos: LightTopo[];
}

export const RootWorldMap: React.FC<RootWorldMapProps> = watchDependencies(
	(props: RootWorldMapProps) => {
		const auth = useAuth();
		const user = auth.session();

		const [selectedTopo, setSelectedTopo] = useState<LightTopo>();

		// TODO: Ideally we should have the TopoFilters component right here,
		// but for now we pass a quark and the domain through MapControl
		// That way, we can take the TopoMarkers out of MapControl and filter here
		let maxBoulders = 0;
		for (const topo of props.lightTopos) {
			maxBoulders = Math.max(maxBoulders, topo.nbBoulders);
		}
		const topoFilterDomain: TopoFilterOptions = {
			types: 0,
			boulderRange: [0, maxBoulders],
			gradeRange: [3, 9],
			adaptedToChildren: false,
		};
		const topoFilters = useCreateQuark(topoFilterDomain);

		const filterFn = (topo: LightTopo) => {
			const options = topoFilters();
			//TODO : check if this works
			if (options.types !== TopoTypes.None && !hasFlag(options.types, topo.type)) {
				return false;
			}
			if (
				topo.nbBoulders < options.boulderRange[0] ||
				topo.nbBoulders > options.boulderRange[1]
			) {
				return false;
			}
			if (options.gradeRange[0] !== 3 || options.gradeRange[1] !== 9) {
				const foundBouldersAtGrade = Object.entries(topo.grades || {}).some(
					([grade, count]) =>
						Number(grade) >= options.gradeRange[0] &&
						Number(grade) <= options.gradeRange[1] &&
						count !== 0
				);

				if (!foundBouldersAtGrade) {
					return false;
				}
			}
			return options.adaptedToChildren
				? hasFlag(topo.amenities, Amenities.AdaptedToChildren)
				: true;
		};

		return (
			<>
				<HeaderDesktop
					backLink="#"
					title="Carte des topo"
					displayLogin={user ? false : true}
				/>

				<div className="relative flex h-contentPlusHeader flex-row md:h-full">
					{user && <LeftbarDesktop currentMenuItem="MAP" />}

					<MapControl
						initialZoom={5}
						searchbarOptions={{
							findTopos: true,
							findPlaces: true,
						}}
						topoFilters={topoFilters}
						topoFiltersDomain={topoFilterDomain}
					>
						{props.lightTopos.filter(filterFn).map((topo) => (
							<TopoMarker
								key={topo.id}
								topo={topo}
								onClick={(t) => setSelectedTopo(t)}
							/>
						))}
					</MapControl>

						{selectedTopo &&	
							<TopoPreview
								topo={selectedTopo}
								displayLikeDownload
								// displayCreator
								displayParking
								mainButton={{ content: 'Ouvrir', link: '/topo/' + encodeUUID(selectedTopo.id) }}
								onClose={() => setSelectedTopo(undefined)}
							/>
						}
				</div>
			</>
		);
	}
);
