import React, { useContext, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { BoulderMarker, For, Header, LeftbarDesktop, MapControl } from 'components';
import { useRouter } from 'next/router';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import { DeviceContext } from 'helpers';
import { Boulder, Track } from 'types';
import { reactKey, useSelectQuark } from 'helpers/quarky';

const Topo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const device = useContext(DeviceContext);
  const topo = quarkTopo;
  if (typeof id !== 'string' || !topo) return null;

  const boulders = useMemo(() => topo().sectors
      .lazy()
      .map(x => x.boulders.quarks())
      .flatten()
      , [topo().sectors]);

  const selectedTrack = useSelectQuark<Track>();
  const selectedBoulder = useSelectQuark<Boulder>();

  const [displayInfo, setDisplayInfo] = useState<boolean>(false);
  const [displayApproach, setDisplayApproach] = useState<boolean>(false);
  const [displayManagement, setDisplayManagement] = useState<boolean>(false);
  const [currentDisplay, setCurrentDisplay] = useState<'INFO' | 'APPROACH' | 'MANAGEMENT'>();
  useEffect(() => {
    if (currentDisplay === 'INFO') {
      setDisplayInfo(true);
      setTimeout(() => {
        setDisplayApproach(false);
        setDisplayManagement(false);
      }, 150)
    } else if (currentDisplay === 'APPROACH') {
      setDisplayApproach(true);
      setTimeout(() => {
        setDisplayInfo(false);
        setDisplayManagement(false)
      }, 150)
    } else if (currentDisplay === 'MANAGEMENT') {
      setDisplayManagement(true);
      setTimeout(() => {
        setDisplayInfo(false);
        setDisplayApproach(false)
      }, 150)
    }
  }, [currentDisplay]);

  return (
    <>
      <Header
        title={topo.name}
        backLink='/'
        menuOptions={[
          { value: 'Infos du topo', action: () => setCurrentDisplay('INFO')},
          { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH')},
          { value: 'Gestionnaires du site', action: () => setCurrentDisplay('MANAGEMENT')},
        ]}
      />

      <div className="h-full relative flex flex-row md:overflow-hidden">
        {device === 'DESKTOP' &&
          <LeftbarDesktop
              currentMenuItem="MAP"
          />
        }

        <MapControl
          initialZoom={5}
          displayPhotoButton={false}
          boundsToMarkers
          searchbarOptions={{
              findTopos: false,
              findPlaces: false,
          }}
        >
          <For each={boulders.toArray}>
              {(boulder) =>
                  <BoulderMarker
                    key={reactKey(boulder)}
                    boulder={boulder}
                    onClick={selectedBoulder.select}
                  />
              }
          </For>
        </MapControl>
        
        

      </div> 
      
    </>
  );
};

export default Topo;