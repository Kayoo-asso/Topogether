import React, { useCallback, useContext } from 'react';
import { DeviceContext, fontainebleauLocation } from 'helpers';
import type { NextPage } from 'next';
import { HeaderDesktop, LeftbarDesktop, MapControl } from 'components';
import { LightTopo } from 'types';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import { Quark, QuarkIter, useSelectQuark } from 'helpers/quarky';

const WorldMapPage: NextPage = () => {
  const device = useContext(DeviceContext);

  const topos: QuarkIter<Quark<LightTopo>> = new QuarkIter(quarkTopo);

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
          initialZoom={8}
          center={fontainebleauLocation}
          displayPhotoButton={false}
          boundsToMarkers
          searchbarOptions={{
              findTopos: false,
              findPlaces: false,
          }}
          topos={topos}
          displayTopoFilter
          onTopoClick={toggleTopoSelect}
        />

      </div>
    </>
  )
};

export default WorldMapPage;
