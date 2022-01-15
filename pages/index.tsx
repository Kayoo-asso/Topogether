import React, { useCallback, useContext } from 'react';
import { DeviceContext, fontainebleauLocation } from 'helpers';
import type { NextPage } from 'next';
import { HeaderDesktop, LeftbarDesktop, MapControl, Show, TopoModal } from 'components';
import { LightTopo } from 'types';
import { Quark, QuarkIter, useSelectQuark } from 'helpers/quarky';
import { quarkLightTopo } from 'helpers/fakeData/fakeLightTopoV2';

const WorldMapPage: NextPage = () => {
  const device = useContext(DeviceContext);

  const topos: QuarkIter<Quark<LightTopo>> = new QuarkIter([quarkLightTopo]);

  const selectedTopo = useSelectQuark<LightTopo>();
  const toggleTopoSelect = useCallback((topoQuark: Quark<LightTopo>) => {
    if (selectedTopo()?.id === topoQuark().id)
      selectedTopo.select(undefined);
    else selectedTopo.select(topoQuark)
  }, [selectedTopo]);

  return (
    <>
      <HeaderDesktop
        backLink="#"
        title="Carte des topos"
      />

      <div className="flex flex-row h-full">
        <LeftbarDesktop
          currentMenuItem="MAP"
        />

        <MapControl
          initialZoom={5}
          center={fontainebleauLocation}
          displayPhotoButton={false}
          boundsToMarkers={true}
          topos={topos}
          displayTopoFilter
          onTopoClick={toggleTopoSelect}
        />

      </div>
      
      <Show when={selectedTopo.quark}>
          {(topo) => (
            <TopoModal 
              open
              topo={topo}
              onClose={() => selectedTopo.select(undefined)}
            />
      )}
      </Show>
    </>
  )
};

export default WorldMapPage;
