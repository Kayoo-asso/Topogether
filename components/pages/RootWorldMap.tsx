import React, { useCallback, useState } from 'react';
import {
  MapControl, Show, TopoPreview,
} from 'components';

import { HeaderDesktop, LeftbarDesktop } from 'components/layouts';
import { LightTopo, Session } from 'types';
import { fontainebleauLocation, toLatLng } from 'helpers';

interface RootWorldMapProps {
  lightTopos: LightTopo[],
  user: Session | null,
}

export const RootWorldMap: React.FC<RootWorldMapProps> = (props: RootWorldMapProps) => {
  const [selectedTopo, setSelectedTopo] = useState<LightTopo>();
  const toggleTopoSelect = useCallback((t: LightTopo) => {
    if (selectedTopo?.id === t.id) {
      setSelectedTopo(undefined);
    } else setSelectedTopo(t);
  }, [selectedTopo]);

  return (
    <>
      <HeaderDesktop
        backLink="#"
        title="Carte des topo"
        displayLogin={props.user ? false : true}
      />

      <div className="flex flex-row relative h-contentPlusHeader md:h-full">
        <LeftbarDesktop
          currentMenuItem="MAP"
        />

        <MapControl
          initialZoom={5}
          topos={props.lightTopos}
          searchbarOptions={{
            findTopos: true,
            findPlaces: true,
          }}
          displayTopoFilter
          onTopoClick={toggleTopoSelect}
          center={toLatLng(fontainebleauLocation)}
          boundsTo={props.lightTopos.map(t => t.location)}
        />

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
};
