import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { 
  AccessSlideover, InfoSlideover, ManagementSlideover,
  BoulderSlideagainstDesktop,  BoulderSlideoverMobile, TrackSlideagainstDesktop, SectorSlideoverMobile,
  Show, Header,
  MapControl, ParkingSlide, WaypointSlide, TracksImage, LeftbarTopoDesktop } from 'components';
import { defaultImage, DeviceContext, sortBoulders, toLatLng } from 'helpers';
import { Boulder, BoulderImage, isUUID, Parking, Sector, Topo, Track, Waypoint } from 'types';
import { Quark, QuarkIter, useCreateDerivation, useLazyQuarkyEffect, useQuarkyCallback, useSelectQuark, watchDependencies } from 'helpers/quarky';
import { useRouter } from 'next/router';


interface RootTopoProps {
  topoQuark: Quark<Topo>,
}

export const RootTopo: React.FC<RootTopoProps> = watchDependencies((props: RootTopoProps) => {
  const router = useRouter();
  const { b: bId } = router.query; // Get boulder id from url if selected 
  const device = useContext(DeviceContext);
  const firstRender = useRef(true);
  const topo = props.topoQuark();
  
  const sectors = useMemo(() => topo.sectors?.quarks(), [topo.sectors]) || new QuarkIter<Quark<Parking>>([]);
  const boulders = useMemo(() => topo.boulders?.quarks(), [topo.boulders]) || new QuarkIter<Quark<Boulder>>([])
  const parkings = useMemo(() => topo.parkings?.quarks(), [topo.parkings]) || new QuarkIter<Quark<Parking>>([]);
  const waypoints = useMemo(() => topo.waypoints?.quarks(), [topo.waypoints]) || new QuarkIter<Quark<Waypoint>>([]);
  const boulderOrder = useCreateDerivation(() => sortBoulders(topo.sectors, topo.lonelyBoulders));
  
  const [currentImage, setCurrentImage] = useState<BoulderImage>(defaultImage);
  const selectedSector = useSelectQuark<Sector>();
  const selectedBoulder = useSelectQuark<Boulder>();
  const selectedTrack = useSelectQuark<Track>();
  const selectedParking = useSelectQuark<Parking>();
  const selectedWaypoint = useSelectQuark<Waypoint>();



  const toggleSectorSelect = useCallback((e, sectorQuark: Quark<Sector>) => {
    if (selectedSector()?.id === sectorQuark().id)
      selectedSector.select(undefined);
    else selectedSector.select(sectorQuark);
  }, [selectedSector, selectedBoulder]);
  const toggleBoulderSelect = useQuarkyCallback((boulderQuark: Quark<Boulder>) => {
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    const boulder = boulderQuark();
    if (selectedBoulder()?.id === boulder.id)
        selectedBoulder.select(undefined);
    else {
      if (boulder.images[0]) setCurrentImage(boulder.images[0]);
      selectedBoulder.select(boulderQuark);
    }
  }, [selectedBoulder]);

  // Hack: select boulder from query parameter
  if (firstRender.current) {
    firstRender.current = false;
    if (typeof bId === "string" && isUUID(bId)) {
      const boulder = boulders.find((b) => b().id === bId)();
      if (boulder) toggleBoulderSelect(boulder);
    }
  }

  const toggleTrackSelect = useCallback((trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => {
    selectedBoulder.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedTrack()?.id === trackQuark().id) { selectedTrack.select(undefined); } else {
      selectedBoulder.select(boulderQuark);
      selectedTrack.select(trackQuark);
    }
  }, [selectedTrack]);
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
  useLazyQuarkyEffect(([boulder]) => {
    if (boulder) router.push({ pathname: window.location.href.split('?')[0], query: { b: boulder.id } }, undefined, { shallow: true });
    else router.push({ pathname: window.location.href.split('?')[0] }, undefined, { shallow: true })
  }, [selectedBoulder]);

  const [displaySectorSlideover, setDisplaySectorSlideover] = useState<boolean>(false);
  const [displayInfo, setDisplayInfo] = useState<boolean>(false);
  const [displayApproach, setDisplayApproach] = useState<boolean>(false);
  const [displayManagement, setDisplayManagement] = useState<boolean>(false);
  const [currentDisplay, setCurrentDisplay] = useState<'INFO' | 'APPROACH' | 'MANAGEMENT' | 'none'>();
  useEffect(() => {
    if (currentDisplay !== undefined) {
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
      } else {
        setDisplayInfo(false);
        setDisplayApproach(false);
        setDisplayManagement(false);
      }
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

      <div className="h-content md:h-full relative flex flex-row md:overflow-hidden">
        <LeftbarTopoDesktop
          topoQuark={props.topoQuark}
          boulderOrder={boulderOrder()}
          selectedBoulder={selectedBoulder}
          onBoulderSelect={toggleBoulderSelect}
          onTrackSelect={toggleTrackSelect}
        />
        <Show when={() => [device === 'MOBILE', displaySectorSlideover] as const}>
          {() => (
            <SectorSlideoverMobile 
              topoQuark={props.topoQuark}
              boulderOrder={boulderOrder()}
              selectedBoulder={selectedBoulder}
              onBoulderSelect={toggleBoulderSelect}
              onTrackSelect={toggleTrackSelect}
              onClose={() => setDisplaySectorSlideover(false)}
            />
          )}
        </Show>

        <Show when={() => displayInfo}>
          <InfoSlideover 
            topo={props.topoQuark}
            open={displayInfo}
            onClose={() => setCurrentDisplay('none')}
            className={currentDisplay === 'INFO' ? 'z-100' : 'z-50'}
          />
        </Show>
        <Show when={() => displayApproach}>
          <AccessSlideover
            accesses={topo.accesses}
            open={displayApproach}
            onClose={() => setCurrentDisplay('none')}
            className={currentDisplay === 'APPROACH' ? 'z-100' : 'z-50'}
          />
        </Show>
        <Show when={() => displayManagement}>
          <ManagementSlideover
            managers={topo.managers}
            open={displayManagement}
            onClose={() => setCurrentDisplay('none')}
            className={currentDisplay === 'MANAGEMENT' ? 'z-100' : 'z-50'}
          />
        </Show>


        <MapControl
          initialZoom={16}
          displaySectorButton
          onSectorButtonClick={() => setDisplaySectorSlideover(true)}
          searchbarOptions={{
            findBoulders: true,
          }}
          onBoulderResultSelect={(boulder) => toggleBoulderSelect(boulders.find(b => b().id === boulder.id)()!)}
          topo={props.topoQuark}
          sectors={sectors}
          selectedSector={selectedSector} 
          onSectorClick={toggleSectorSelect}
          boulders={boulders}
          selectedBoulder={selectedBoulder}
          bouldersOrder={boulderOrder()}
          displayBoulderFilter
          waypoints={waypoints}
          selectedWaypoint={selectedWaypoint}
          onWaypointClick={toggleWaypointSelect}
          onBoulderClick={toggleBoulderSelect}
          parkings={parkings}
          selectedParking={selectedParking}
          onParkingClick={toggleParkingSelect}
          center={toLatLng(topo.location)}
          boundsTo={boulders.toArray().map(b => b().location).concat(parkings.toArray().map(p => p().location))}
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
                    tracks={new QuarkIter([track])}
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
                  topoCreatorId={topo.creator?.id}
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
                topoCreatorId={topo.creator?.id}
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
});

RootTopo.displayName = "RootTopo";