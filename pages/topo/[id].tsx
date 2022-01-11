import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { 
  ApproachSlideover, InfoSlideover, ManagementSlideover,
  BoulderSlideagainstDesktop,  BoulderSlideoverMobile, TrackSlideagainstDesktop,
  For, Show,
  Header, LeftbarDesktop, 
  MapControl, BoulderMarker } from 'components';
import { useRouter } from 'next/router';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import { DeviceContext } from 'helpers';
import { Boulder, Track } from 'types';
import { Quark, reactKey, useSelectQuark, watchDependencies } from 'helpers/quarky';

const Topo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const device = useContext(DeviceContext);

  const topo = quarkTopo;
  const boulders = useMemo(() => topo().sectors
      .lazy()
      .map(x => x.boulders.quarks())
      .flatten()
      , [topo().sectors]);

  const selectedTrack = useSelectQuark<Track>();
  const selectedBoulder = useSelectQuark<Boulder>();

  const toggleBoulderSelect = useCallback((boulderQuark: Quark<Boulder>) => {
    if (selectedBoulder()?.id === boulderQuark().id)
        selectedBoulder.select(undefined);
    else selectedBoulder.select(boulderQuark)
  }, [selectedBoulder]);

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

  if (typeof id !== 'string' || !topo) return null;
  return (
    <>
      <Header
        title={topo().name}
        backLink='/'
        menuOptions={[
          { value: 'Infos du topo', action: () => setCurrentDisplay('INFO')},
          { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH')},
          { value: 'Gestionnaires du site', action: () => setCurrentDisplay('MANAGEMENT')},
        ]}
      />

      <div className="h-full relative flex flex-row md:overflow-hidden">
        <LeftbarDesktop
            currentMenuItem="MAP"
        />

        <Show when={() => displayInfo}>
          <InfoSlideover 
            topo={topo}
            open={displayInfo}
            onClose={() => { setDisplayInfo(false) }}
            className={currentDisplay === 'INFO' ? 'z-100' : ''}
          />
        </Show>
        <Show when={() => displayApproach}>
          <ApproachSlideover
            topo={topo}
            open={displayApproach}
            onClose={() => { setDisplayApproach(false) }}
            className={currentDisplay === 'APPROACH' ? 'z-100' : ''}
          />
        </Show>
        <Show when={() => displayManagement}>
          <ManagementSlideover
            topo={topo}
            open={displayManagement}
            onClose={() => { setDisplayManagement(false) }}
            className={currentDisplay === 'MANAGEMENT' ? 'z-100' : ''}
          />
        </Show>


        <MapControl
          initialZoom={16}
          center={boulders.toArray()[0]().location}
          displayPhotoButton={false}
          boundsToMarkers
          searchbarOptions={{
              findTopos: false,
              findPlaces: false,
          }}
        >
          <For each={() => boulders.toArray()}>
              {(boulder) =>
                  <BoulderMarker
                    key={reactKey(boulder)}
                    boulder={boulder}
                    onClick={toggleBoulderSelect}
                  />
              }
          </For>
        </MapControl>
        

        <Show when={() => [device !== 'MOBILE', selectedTrack.quark()] as const}>
          {([, track]) => 
            <TrackSlideagainstDesktop 
              track={track}
              onClose={() => selectedTrack.select(undefined)}
            />
          }

        </Show>

        <Show when={selectedBoulder.quark}>
          {(boulder) => {
            if (device === 'MOBILE') {
              return (
                <BoulderSlideoverMobile 
                  open
                  boulder={boulder}
                  selectedTrack={selectedTrack}
                  topoCreatorId={topo().creatorId}
                  onSelectTrack={(track) => selectedTrack.select(track)}
                  onClose={() => {
                    selectedTrack.select(undefined);
                    selectedBoulder.select(undefined);
                  }}
                />
              )
            }
            else return (
              <BoulderSlideagainstDesktop
                open
                boulder={boulder} 
                onSelectTrack={(track) => selectedTrack.select(track)}
                onClose={() => {
                  selectedTrack.select(undefined);
                  selectedBoulder.select(undefined);
                }}
              />
            )
          }}
        </Show>

      </div> 
      
    </>
  );
};

export default watchDependencies(Topo);