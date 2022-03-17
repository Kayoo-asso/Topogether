import React, { useCallback } from 'react';
import type { NextPage } from 'next';
import {
 HeaderDesktop, LeftbarDesktop, MapControl, Show, TopoPreview,
} from 'components';
import { LightTopo } from 'types';
import { Quark, QuarkIter, useSelectQuark, watchDependencies } from 'helpers/quarky';
import { quarkLightTopo } from 'helpers/fakeData/fakeLightTopoV2';
import { api } from 'helpers/services/ApiService';
import { fontainebleauLocation, toLatLng } from 'helpers';
import { saveFakeTopo } from 'helpers/fakeData/saveFakeTopo';

const WorldMapPage: NextPage = () => {
  const session = api.user();

  // saveFakeTopo();
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
        displayLogin={session ? false : true}
      />

      <div className="flex flex-row relative h-contentPlusHeader md:h-full">
        <LeftbarDesktop
          currentMenuItem="MAP"
        />

        <MapControl
          initialZoom={5}
          topos={topos}
          displayTopoFilter
          onTopoClick={toggleTopoSelect}
          center={toLatLng(fontainebleauLocation)}
          boundsTo={topos.toArray().map(t => t().location)}
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

export default watchDependencies(WorldMapPage);
