import React, { useCallback, useState } from 'react';
import {
 HeaderDesktop, LeftbarDesktop, MapControl, Show, TopoPreview,
} from 'components';
import { LightTopo, User } from 'types';
import { fontainebleauLocation, toLatLng } from 'helpers';
import { saveFakeTopo } from 'helpers/fakeData/saveFakeTopo';

interface RootWorldMapProps {
    lightTopos: LightTopo[],
    user: User | null,
}

export const RootWorldMap: React.FC<RootWorldMapProps> = (props: RootWorldMapProps) => {
  saveFakeTopo();

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
        title="Carte des topos"
        displayLogin={props.user ? false : true}
      />

      <div className="flex flex-row relative h-contentPlusHeader md:h-full">
        <LeftbarDesktop
          currentMenuItem="MAP"
        />

        <MapControl
          initialZoom={5}
          topos={props.lightTopos}
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
