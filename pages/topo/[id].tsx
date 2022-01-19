import React, { useContext, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { 
  ApproachSlideover, InfoSlideover, ManagementSlideover,
  BoulderSlideagainstDesktop,  BoulderSlideoverMobile, TrackSlideagainstDesktop,
  For, Show,
  Header, LeftbarDesktop, 
  MapControl, ParkingSlide } from 'components';
import { useRouter } from 'next/router';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import { DeviceContext } from 'helpers';
import { Boulder, Parking, Track, Waypoint } from 'types';
import { Quark, QuarkIter, useQuarkyCallback, useSelectQuark, watchDependencies } from 'helpers/quarky';

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
    else selectedBoulder.select(boulderQuark)
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
            topo={topo}
            open={displayApproach}
            onClose={() => setCurrentDisplay(undefined)}
            className={currentDisplay === 'APPROACH' ? 'z-100' : 'z-50'}
          />
        </Show>
        <Show when={() => displayManagement}>
          <ManagementSlideover
            topo={topo}
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
                boulder={boulder}
                selectedTrack={selectedTrack}
                topoCreatorId={topo().creatorId}
                onSelectTrack={(track) => {
                  // console.log(track())
                  selectedTrack.select(track)}}
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
                  onClose={() => {
                    selectedParking.select(undefined);
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