import React, { useCallback } from 'react';
import { fontainebleauLocation } from 'helpers';
import type { NextPage } from 'next';
import {
 HeaderDesktop, LeftbarDesktop, MapControl, Show, TopoPreview,
} from 'components';
import { LightTopo } from 'types';
import { Quark, QuarkIter, useSelectQuark } from 'helpers/quarky';
import { quarkLightTopo } from 'helpers/fakeData/fakeLightTopoV2';

const WorldMapPage: NextPage = () => {
  const topos: QuarkIter<Quark<LightTopo>> = new QuarkIter([quarkLightTopo]);

  const selectedTopo = useSelectQuark<LightTopo>();
  const toggleTopoSelect = useCallback((topoQuark: Quark<LightTopo>) => {
    if (selectedTopo()?.id === topoQuark().id) {
      selectedTopo.select(undefined);
    } else selectedTopo.select(topoQuark);
  }, [selectedTopo]);

  return (
    <>
      <HeaderDesktop
        backLink="#"
        title="Carte des topos"
      />

      <div className="flex flex-row relative h-contentPlusHeader md:h-full">
        <LeftbarDesktop
          currentMenuItem="MAP"
        />

        <MapControl
          initialZoom={5}
          center={fontainebleauLocation}
          displayPhotoButton={false}
          boundsToMarkers
          topos={topos}
          displayTopoFilter
          onTopoClick={toggleTopoSelect}
        />

        <Show when={selectedTopo.quark}>
          {(topo) => (
            <TopoPreview
              topo={topo}
              onClose={() => selectedTopo.select(undefined)}
            />
            )}
        </Show>
      </div>
    </>
  );
};

export default WorldMapPage;
