import React, { useContext, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { 
  ApproachSlideover, InfoSlideover, ManagementSlideover,
  BoulderSlideagainstDesktop,  BoulderSlideoverMobile, TrackSlideagainstDesktop,
  Show,
  Header, LeftbarDesktop, 
  MapControl, ParkingSlide, WaypointSlide, TracksImage } from 'components';
import { useRouter } from 'next/router';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import { defaultImage, DeviceContext } from 'helpers';
import { Boulder, Image, Parking, Track, Waypoint } from 'types';
import { Quark, QuarkArray, QuarkIter, useQuarkyCallback, useSelectQuark, watchDependencies } from 'helpers/quarky';

const Topo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const device = useContext(DeviceContext);

  const topo = quarkTopo;
  const boulders = useMemo(() => topo().sectors
      .lazy()
      .map(s => s.boulders.quarks())
      .flatten()
  , [topo().sectors]);
  const parkings = useMemo(() => topo().parkings?.quarks(), [topo().parkings]) || new QuarkIter<Quark<Parking>>([]);
  const waypoints = useMemo(() => topo().sectors
      .lazy()
      .map(s => s.waypoints.quarks())
      .flatten()
  , [topo().sectors]) || new QuarkIter<Quark<Waypoint>>([]);

  const [currentImage, setCurrentImage] = useState<Image>(defaultImage);
  const selectedTrack = useSelectQuark<Track>();
  const selectedBoulder = useSelectQuark<Boulder>();
  const selectedParking = useSelectQuark<Parking>();
  const selectedWaypoint = useSelectQuark<Waypoint>();

  const toggleBoulderSelect = useQuarkyCallback((boulderQuark: Quark<Boulder>) => {
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedBoulder()?.id === boulderQuark().id)
        selectedBoulder.select(undefined);
    else {
      setCurrentImage(boulderQuark().images[0]);
      selectedBoulder.select(boulderQuark);
    }
  }, [selectedBoulder]);
  const toggleParkingSelect = useQuarkyCallback((parkingQuark: Quark<Parking>) => {
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedParking()?.id === parkingQuark().id)
      selectedParking.select(undefined);
    else selectedParking.select(parkingQuark)
  }, [selectedParking]);
  const toggleWaypointSelect = useQuarkyCallback((waypointQuark: Quark<Waypoint>) => {
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    if (selectedWaypoint()?.id === waypointQuark().id)
      selectedWaypoint.select(undefined);
    else selectedWaypoint.select(waypointQuark)
  }, [selectedWaypoint]);

  const [displayInfo, setDisplayInfo] = useState<boolean>(false);
  const [displayApproach, setDisplayApproach] = useState<boolean>(false);
  const [displayManagement, setDisplayManagement] = useState<boolean>(false);
  const [currentDisplay, setCurrentDisplay] = useState<'INFO' | 'APPROACH' | 'MANAGEMENT' | undefined>();
  useEffect(() => {
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
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
        setDisplayManagement(false);
      }, 150)
    } else if (currentDisplay === 'MANAGEMENT') {
      setDisplayManagement(true);
      setTimeout(() => {
        setDisplayInfo(false);
        setDisplayApproach(false);
      }, 150)
    }
    else {
      setDisplayInfo(false);
      setDisplayApproach(false);
      setDisplayManagement(false);
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

      <div className="h-content md:h-full relative flex flex-row md:overflow-hidden">
        <LeftbarDesktop
            currentMenuItem="MAP"
        />

        <Show when={() => displayInfo}>
          <InfoSlideover 
            topo={topo}
            open={displayInfo}
            onClose={() => setCurrentDisplay(undefined)}
            className={currentDisplay === 'INFO' ? 'z-100' : 'z-50'}
          />
        </Show>
        <Show when={() => displayApproach}>
          <ApproachSlideover
            accesses={topo().accesses}
            open={displayApproach}
            onClose={() => setCurrentDisplay(undefined)}
            className={currentDisplay === 'APPROACH' ? 'z-100' : 'z-50'}
          />
        </Show>
        <Show when={() => displayManagement}>
          <ManagementSlideover
            managers={topo().managers}
            open={displayManagement}
            onClose={() => setCurrentDisplay(undefined)}
            className={currentDisplay === 'MANAGEMENT' ? 'z-100' : 'z-50'}
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
          waypoints={waypoints}
          onWaypointClick={toggleWaypointSelect}
          boulders={boulders}
          displayBoulderFilter
          onBoulderClick={toggleBoulderSelect}
          parkings={parkings}
          onParkingClick={toggleParkingSelect}
        />
        

        <Show when={() => [device !== 'MOBILE', selectedTrack.quark()] as const}>
          {([, track]) => 
            <>
              <TrackSlideagainstDesktop 
                track={track}
                onClose={() => selectedTrack.select(undefined)}
              />
              <div className="absolute top-0 bg-black bg-opacity-90 h-full flex flex-col z-1000 w-full md:w-[calc(100%-600px)]">
                <div className="flex-1 flex items-center relative">
                  {/* TODO: CHANGE SIZING */}
                  <TracksImage
                    image={currentImage}
                    tracks={new QuarkArray([track()])}
                    selectedTrack={selectedTrack}
                    displayTracksDetails
                  />
                </div>
              </div>
            </>
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
                  currentImage={currentImage}
                  setCurrentImage={setCurrentImage}
                  onClose={() => {
                    selectedTrack.select(undefined);
                    selectedBoulder.select(undefined);
                  }}
                />
              )
            }
            else return (
              <BoulderSlideagainstDesktop
                boulder={boulder}
                selectedTrack={selectedTrack}
                topoCreatorId={topo().creatorId}
                currentImage={currentImage || defaultImage}
                setCurrentImage={setCurrentImage}
                onClose={() => {
                  selectedTrack.select(undefined);
                  selectedBoulder.select(undefined);
                }}
              />
            )
          }}
        </Show>

        <Show when={selectedParking.quark}>
          {(parking) => {
              return (
                <ParkingSlide 
                  open
                  parking={parking}
                  onClose={() => selectedParking.select(undefined)}
                />
              )
          }}
        </Show> 
        <Show when={selectedWaypoint.quark}>
          {(waypoint) => {
              return (
                <WaypointSlide 
                  open
                  waypoint={waypoint}
                  onClose={() => selectedWaypoint.select(undefined)}
                />
              )
          }}
        </Show>

      </div> 
      
    </>
  );
};

export default watchDependencies(Topo);