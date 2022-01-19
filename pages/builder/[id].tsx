import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { 
  BoulderBuilderSlideoverMobile,
  MapControl, Show, 
  Header, InfoFormSlideover, ApproachFormSlideover, ManagementFormSlideover, TrackFormSlideagainstDesktop, ModalValidateTopo, ModalDeleteTopo, GeoCamera, Drawer, LeftbarBuilderDesktop, BoulderBuilderSlideagainstDesktop } from 'components';
import { useRouter } from 'next/router';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import { DeviceContext, UserContext } from 'helpers';
import { Boulder, Image, MapToolEnum, Parking, Track, Waypoint } from 'types';
import { Quark, QuarkIter, reactKey, useSelectQuark, watchDependencies } from 'helpers/quarky';


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
  const parkings = useMemo(() => topo().parkings?.quarks(), [topo().parkings]) || new QuarkIter<Quark<Parking>>([]);
  const waypoints = useMemo(() => topo().sectors
      .lazy()
      .map(s => s.waypoints.quarks())
      .flatten()
      , [topo().sectors]) || new QuarkIter<Quark<Waypoint>>([]);

  const [currentTool, setCurrentTool] = useState<MapToolEnum>();
  const [currentImage, setCurrentImage] = useState<Image>();
  const selectedTrack = useSelectQuark<Track>();
  const selectedBoulder = useSelectQuark<Boulder>();
  const selectedParking = useSelectQuark<Parking>();
  const selectedWaypoint = useSelectQuark<Waypoint>();

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

  const toggleBoulderSelect = useCallback((boulderQuark: Quark<Boulder>) => {
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedBoulder()?.id === boulderQuark().id)
        selectedBoulder.select(undefined);
    else selectedBoulder.select(boulderQuark)
  }, [selectedBoulder]);
  const toggleParkingSelect = useCallback((parkingQuark: Quark<Parking>) => {
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedParking()?.id === parkingQuark().id)
      selectedParking.select(undefined);
    else selectedParking.select(parkingQuark)
  }, [selectedParking]);
  const toggleWaypointSelect = useCallback((waypointQuark: Quark<Waypoint>) => {
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    if (selectedWaypoint()?.id === waypointQuark().id)
      selectedWaypoint.select(undefined);
    else selectedWaypoint.select(waypointQuark)
  }, [selectedWaypoint]);

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
        <LeftbarBuilderDesktop 
          sectors={topo().sectors.quarks()}
          selectedBoulder={selectedBoulder}
          onBoulderSelect={toggleBoulderSelect}
          onValidate={() => setDisplayModalValidate(true)}
        />

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
          initialZoom={16}
          center={boulders.toArray()[0]().location}
          boundsToMarkers
          searchbarOptions={{
              findTopos: false,
              findPlaces: false,
          }}
          waypoints={waypoints}
          onWaypointClick={toggleWaypointSelect}
          boulders={boulders}
          displayBoulderFilter
          onBoulderClick={toggleBoulderSelect}
          parkings={parkings}
          onParkingClick={toggleParkingSelect}
          onPhotoButtonClick={() => setDisplayGeoCamera(true)}
        />


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
              <BoulderBuilderSlideagainstDesktop
                boulder={boulder} 
                topoCreatorId={topo().creatorId}
                selectedTrack={selectedTrack}
                setCurrentImage={setCurrentImage}
                currentImage={currentImage}
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
            onClose={() => setDisplayGeoCamera(false)}
          />
        </Show>

        <Show when={() => [(device !== 'MOBILE' || displayDrawer), selectedBoulder(), selectedTrack()] as const}>
          {([, sBoulder, sTrack]) => (
            <Drawer  
              image={sBoulder.images.find(img => img.id === sTrack.lines.lazy().toArray()[0]?.imageId) || currentImage!}
              tracks={sBoulder.tracks}
              selectedTrack={selectedTrack}
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
