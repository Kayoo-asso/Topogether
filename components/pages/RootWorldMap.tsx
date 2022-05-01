import React, { useCallback, useState } from 'react';
import { MapControl, Show, TopoFilterOptions, TopoPreview } from 'components';
import { HeaderDesktop, LeftbarDesktop } from 'components/layouts';
import { Amenities, LightTopo } from 'types';
import { useAuth } from 'helpers/services';
import { useCreateQuark, watchDependencies } from 'helpers/quarky';
import { hasFlag } from 'helpers';
import { TopoMarker } from 'components/atoms';

interface RootWorldMapProps {
  lightTopos: LightTopo[],
}

export const RootWorldMap: React.FC<RootWorldMapProps> = watchDependencies((props: RootWorldMapProps) => {
  const auth = useAuth();
  const user = auth.session();

  const [selectedTopo, setSelectedTopo] = useState<LightTopo>();
  const toggleTopoSelect = useCallback((t: LightTopo) => {
    if (selectedTopo?.id === t.id) {
      setSelectedTopo(undefined);
    } else setSelectedTopo(t);
  }, [selectedTopo]);

  // TODO: Ideally we should have the TopoFilters component right here,
  // but for now we pass a quark and the domain through MapControl
  // That way, we can take the TopoMarkers out of MapControl and filter here
  let maxBoulders = 0;
  for (const topo of props.lightTopos) {
    maxBoulders = Math.max(maxBoulders, topo.nbBoulders);
  }
  const topoFilterDomain: TopoFilterOptions = {
    types: [],
    boulderRange: [0, maxBoulders],
    gradeRange: [3, 9],
    adaptedToChildren: false,
  };
  const topoFilters = useCreateQuark(topoFilterDomain);

  const filterFn = (topo: LightTopo) => {
    const options = topoFilters();
    if (options.types.length && !options.types.includes(topo.type!)) {
      return false;
    }
    if (topo.nbBoulders < options.boulderRange[0] || topo.nbBoulders > options.boulderRange[1]) {
      return false;
    }
    if (options.gradeRange[0] !== 3 || options.gradeRange[1] !== 9) {
      const foundBouldersAtGrade = Object.entries(topo.grades || {}).some(([grade, count]) =>
        Number(grade) >= options.gradeRange[0] && Number(grade) <= options.gradeRange[1] && count !== 0);
  
      if (!foundBouldersAtGrade) {
        return false;
      }
    }
    return options.adaptedToChildren ? hasFlag(topo.amenities, Amenities.AdaptedToChildren) : true;
  }


  return (
    <>
      <HeaderDesktop
        backLink="#"
        title="Carte des topo"
        displayLogin={user ? false : true}
      />

      <div className="flex flex-row relative h-contentPlusHeader md:h-full">
        {user &&
          <LeftbarDesktop
            currentMenuItem="MAP"
          />
        }

        <MapControl
          initialZoom={5}
          searchbarOptions={{
            findTopos: true,
            findPlaces: true,
          }}
          topoFilters={topoFilters}
          topoFiltersDomain={topoFilterDomain}
          boundsTo={props.lightTopos.map(t => t.location)}
        >
          {props.lightTopos.filter(filterFn).map(topo => 
            <TopoMarker
              key={topo.id}
              topo={topo}
              onClick={toggleTopoSelect}
            />
          )}
        </MapControl>

        <Show when={() => selectedTopo}>
          {(topo) => (
            <TopoPreview
              topo={topo}
              onClose={() => setSelectedTopo(undefined)}
            />
          )}
        </Show>
      </div>
    </>
  );
});
