import React, { useContext, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { 
  BoulderBuilderSlideoverMobile, BoulderSlideagainstDesktop, TrackSlideagainstDesktop,
  MapControl, BoulderMarker, 
  For, Show, 
  Header, LeftbarDesktop, InfoFormSlideover, ApproachFormSlideover, ManagementFormSlideover, TrackFormSlideagainstDesktop, ModalValidateTopo, ModalDeleteTopo, GeoCamera, Drawer } from 'components';
import { useRouter } from 'next/router';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import { DeviceContext, UserContext } from 'helpers';
import { Boulder, MapToolEnum, Track } from 'types';
import { reactKey, useSelectQuark, watchDependencies } from 'helpers/quarky';

const BuilderMapPage: NextPage = () => {
  const { session } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  const device = useContext(DeviceContext);
  const topo = quarkTopo;
  const boulders = useMemo(() => topo().sectors
      .lazy()
      .map(x => x.boulders.quarks())
      .flatten()
      , [topo().sectors]);

  const [currentTool, setCurrentTool] = useState<MapToolEnum>();
  const selectedTrack = useSelectQuark<Track>();
  const selectedBoulder = useSelectQuark<Boulder>();

  const [displayGeoCamera, setDisplayGeoCamera] = useState(false);
  const [displayDrawer, setDisplayDrawer] = useState(false);

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

  const [displayModalValidate, setDisplayModalValidate] = useState(false);
  const [displayModalDelete, setDisplayModalDelete] = useState(false);

  if (!session || typeof id !== 'string' || !topo) return null;
  return (
    <>
      <Header
        title={topo().name}
        backLink='/'
        menuOptions={[
          { value: 'Infos du topo', action: () => setCurrentDisplay('INFO')},
          { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH')},
          { value: 'Gestionnaires du site', action: () => setCurrentDisplay('MANAGEMENT')},
          { value: 'Valider le topo', action: () => setDisplayModalValidate(!displayModalValidate)},
          { value: 'Supprimer le topo', action: () => setDisplayModalDelete(!displayModalDelete)},
        ]}
        displayMapTools
        MapToolsActivated={!selectedTrack}
        currentTool={currentTool}
        onRockClick={() => setCurrentTool('ROCK')}
        onParkingClick={() => setCurrentTool('PARKING')}
        onWaypointClick={() => setCurrentTool('WAYPOINT')}
      />

      <div className="h-full relative flex flex-row md:overflow-hidden">
        {device !== 'MOBILE' &&
          <LeftbarDesktop
              currentMenuItem="BUILDER"
          />
        }

        <Show when={() => displayInfo}>
          <InfoFormSlideover 
            topo={topo}
            open={displayInfo}
            onClose={() => { setDisplayInfo(false) }}
            className={currentDisplay === 'INFO' ? 'z-100' : ''}
          />
        </Show>
        <Show when={() => displayApproach}>
          <ApproachFormSlideover
            topo={topo}
            open={displayApproach}
            onClose={() => { setDisplayApproach(false) }}
            className={currentDisplay === 'APPROACH' ? 'z-100' : ''}
          />
        </Show>
        <Show when={() => displayManagement}>
          <ManagementFormSlideover
            topo={topo}
            open={displayManagement}
            onClose={() => { setDisplayManagement(false) }}
            className={currentDisplay === 'MANAGEMENT' ? 'z-100' : ''}
          />
        </Show>


        <MapControl
          initialZoom={5}
          center={boulders.toArray()[0]().location}
          boundsToMarkers
          searchbarOptions={{
              findTopos: false,
              findPlaces: false,
          }}
          onPhotoButtonClick={() => setDisplayGeoCamera(true)}
        >
          <For each={() => boulders.toArray()}>
              {(boulder) =>
                  <BoulderMarker
                    key={reactKey(boulder)}
                    boulder={boulder}
                    onClick={selectedBoulder.select}
                  />
              }
          </For>
        </MapControl>
        

        <Show when={() => [device !== 'MOBILE', selectedTrack.quark()] as const}>
          {([, track]) => 
            <TrackFormSlideagainstDesktop
              track={track}
              onClose={() => selectedTrack.select(undefined)}
            />
          }

        </Show>

        <Show when={() => selectedBoulder.quark()}>
          {(boulder) => {
            if (device === 'MOBILE') {
              return (
                <BoulderBuilderSlideoverMobile
                  boulder={boulder}
                  selectedTrack={selectedTrack}
                  onSelectTrack={(track) => selectedTrack.select(track)}
                  onPhotoButtonClick={() => setDisplayGeoCamera(true)}
                  onDrawButtonClick={() => setDisplayDrawer(true)}
                  onClose={() => {
                    selectedTrack.select(undefined);
                    selectedBoulder.select(undefined)
                  }}
                />
              )
            }
            else return (
              <BoulderSlideagainstDesktop
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

        <Show when={() => displayGeoCamera}>
          <GeoCamera
          />
        </Show>
        <Show when={() => [displayDrawer, selectedBoulder(), selectedTrack()] as const}>
          {([, selectedBoulder, selectedTrack]) => (
            <Drawer  
              image={selectedBoulder.images.find(img => img.id === selectedTrack.lines.lazy().toArray()[0].imageId)!}
              tracks={selectedBoulder.tracks.lazy()}
              displayedTrackId={selectedTrack.id}
              onValidate={() => setDisplayDrawer(false)}
            />
          )}
        </Show>

        <Show when={() => displayModalValidate}>
          <ModalValidateTopo 
            topo={topo}
            onClose={() => setDisplayModalValidate(false)}
          />
        </Show>
        <Show when={() => displayModalDelete}>
          <ModalDeleteTopo 
            topo={topo}
            onClose={() => setDisplayModalDelete(false)}
          />
        </Show>

      </div> 
      
    </>
  );
};

export default watchDependencies(BuilderMapPage);
