import React, {
 useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import type { NextPage } from 'next';
import {
  BoulderBuilderSlideoverMobile,
  MapControl, Show,
  Header, InfoFormSlideover, ManagementFormSlideover, TrackFormSlideagainstDesktop, ModalValidateTopo, ModalDeleteTopo, GeoCamera, Drawer, LeftbarBuilderDesktop, BoulderBuilderSlideagainstDesktop, ParkingBuilderSlide, AccessFormSlideover, WaypointBuilderSlide, createTrack,
} from 'components';
import { useRouter } from 'next/router';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import {
 blobToImage, defaultImage, DeviceContext, UserContext,
} from 'helpers';
import {
 Boulder, GeoCoordinates, Image, MapToolEnum, Name, Parking, Track, Waypoint,
} from 'types';
import {
 Quark, QuarkArray, QuarkIter, useSelectQuark, watchDependencies,
} from 'helpers/quarky';
import { v4 } from 'uuid';

const BuilderMapPage: NextPage = () => {
  const { session } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  const device = useContext(DeviceContext);

  const topo = quarkTopo();
  const boulders = useMemo(
() => topo.sectors
      .lazy()
      .map((x) => x.boulders.quarks())
      .flatten(),
       [topo.sectors],
);
  const parkings = useMemo(() => topo.parkings?.quarks(), [topo.parkings]) || new QuarkIter<Quark<Parking>>([]);
  const waypoints = useMemo(
() => topo.sectors
      .lazy()
      .map((s) => s.waypoints.quarks())
      .flatten(),
       [topo.sectors],
) || new QuarkIter<Quark<Waypoint>>([]);

  const [currentTool, setCurrentTool] = useState<MapToolEnum>();
  const [currentImage, setCurrentImage] = useState<Image>(defaultImage);
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
    selectedTrack.select(undefined);
    selectedBoulder.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    if (currentDisplay === 'INFO') {
      setDisplayInfo(true);
      setTimeout(() => {
        setDisplayApproach(false);
        setDisplayManagement(false);
      }, 150);
    } else if (currentDisplay === 'APPROACH') {
      setDisplayApproach(true);
      setTimeout(() => {
        setDisplayInfo(false);
        setDisplayManagement(false);
      }, 150);
    } else if (currentDisplay === 'MANAGEMENT') {
      setDisplayManagement(true);
      setTimeout(() => {
        setDisplayInfo(false);
        setDisplayApproach(false);
      }, 150);
    } else {
      setDisplayInfo(false);
      setDisplayApproach(false);
      setDisplayManagement(false);
    }
  }, [currentDisplay]);

  const [displayModalValidate, setDisplayModalValidate] = useState(false);
  const [displayModalDelete, setDisplayModalDelete] = useState(false);

  const toggleBoulderSelect = useCallback((boulderQuark: Quark<Boulder>) => {
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedBoulder()?.id === boulderQuark().id) { selectedBoulder.select(undefined); } else {
      setCurrentImage(boulderQuark().images[0]);
      selectedBoulder.select(boulderQuark);
    }
  }, [selectedBoulder]);
  const toggleTrackSelect = useCallback((trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => {
    selectedBoulder.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedTrack()?.id === trackQuark().id) { selectedTrack.select(undefined); } else {
      selectedBoulder.select(boulderQuark);
      selectedTrack.select(trackQuark);
    }
  }, [selectedTrack]);
  const toggleParkingSelect = useCallback((parkingQuark: Quark<Parking>) => {
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedParking()?.id === parkingQuark().id) { selectedParking.select(undefined); } else selectedParking.select(parkingQuark);
  }, [selectedParking]);
  const toggleWaypointSelect = useCallback((waypointQuark: Quark<Waypoint>) => {
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    if (selectedWaypoint()?.id === waypointQuark().id) { selectedWaypoint.select(undefined); } else selectedWaypoint.select(waypointQuark);
  }, [selectedWaypoint]);

  const createBoulder = useCallback((location: GeoCoordinates, image?: Image, selectBoulder = false) => {
    const orderIndex = topo.sectors.at(0).boulders.length + 1;
    const newBoulder: Boulder = {
      id: v4(),
      orderIndex,
      name: `Bloc ${orderIndex}` as Name,
      location,
      isHighball: false,
      mustSee: false,
      dangerousDescent: false,
      tracks: new QuarkArray(),
      images: image ? [image] : [],
    };
    topo.sectors.at(0).boulders.push(newBoulder);
    const newBoulderQuark = topo.sectors.at(0).boulders.quarkAt(-1);
    if (selectBoulder) {
      selectedBoulder.select(newBoulderQuark);
      if (image) setCurrentImage(newBoulder.images[0]);
    }
    return newBoulderQuark;
  }, [topo]);
  const createParking = useCallback((location: GeoCoordinates, selectParking = false) => {
    const newParking: Parking = {
      id: v4(),
      spaces: 0,
      name: `parking ${topo.parkings ? topo.parkings.length + 1 : '1'}` as Name,
      location,
    };
    topo.parkings.push(newParking);
    const newParkingQuark = topo.parkings.quarkAt(-1);
    if (selectParking) selectedParking.select(newParkingQuark);
    return newParkingQuark;
  }, [topo]);
  const createWaypoint = useCallback((location: GeoCoordinates, selectWaypoint = false) => {
    const newWaypoint: Waypoint = {
      id: v4(),
      name: `point de repère ${topo.sectors.at(0).waypoints ? topo.sectors.at(0).waypoints.length + 1 : '1'}` as Name,
      location,
    };
    topo.sectors.at(0).waypoints.push(newWaypoint);
    const newWaypointQuark = topo.sectors.at(0).waypoints.quarkAt(-1);
    if (selectWaypoint) selectedWaypoint.select(newWaypointQuark);
    return newWaypointQuark;
  }, [topo]);

  if (!session || typeof id !== 'string' || !topo) return null;
  return (
    <>
      <Header
        title={topo.name}
        backLink="/"
        menuOptions={[
          { value: 'Infos du topo', action: () => setCurrentDisplay('INFO') },
          { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH') },
          { value: 'Gestionnaires du spot', action: () => setCurrentDisplay('MANAGEMENT') },
          { value: 'Valider le topo', action: () => setDisplayModalValidate(!displayModalValidate) },
          { value: 'Supprimer le topo', action: () => setDisplayModalDelete(!displayModalDelete) },
        ]}
        displayMapTools
        MapToolsActivated={!selectedTrack()}
        currentTool={currentTool}
        onRockClick={() => setCurrentTool(currentTool === 'ROCK' ? undefined : 'ROCK')}
        onParkingClick={() => setCurrentTool(currentTool === 'PARKING' ? undefined : 'PARKING')}
        onWaypointClick={() => setCurrentTool(currentTool === 'WAYPOINT' ? undefined : 'WAYPOINT')}
      />

      <div className="h-content md:h-full relative flex flex-row md:overflow-hidden">
        <LeftbarBuilderDesktop
          sectors={topo.sectors.quarks()}
          selectedBoulder={selectedBoulder}
          onBoulderSelect={toggleBoulderSelect}
          onTrackSelect={toggleTrackSelect}
          onValidate={() => setDisplayModalValidate(true)}
        />

        <Show when={() => displayInfo}>
          <InfoFormSlideover
            topo={quarkTopo}
            open
            onClose={() => setCurrentDisplay(undefined)}
            className={currentDisplay === 'INFO' ? 'z-100' : ''}
          />
        </Show>
        <Show when={() => displayApproach}>
          <AccessFormSlideover
            accesses={topo.accesses}
            open={displayApproach}
            onClose={() => setCurrentDisplay(undefined)}
            className={currentDisplay === 'APPROACH' ? 'z-100' : ''}
          />
        </Show>
        <Show when={() => displayManagement}>
          <ManagementFormSlideover
            managers={topo.managers}
            open={displayManagement}
            onClose={() => setCurrentDisplay(undefined)}
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
          draggableCursor={currentTool === 'ROCK' ? 'url(/assets/icons/colored/_rock.svg), auto'
                          : currentTool === 'PARKING' ? 'url(/assets/icons/colored/_parking.svg), auto'
                          : currentTool === 'WAYPOINT' ? 'url(/assets/icons/colored/_help-round.svg), auto'
                          : ''}
          waypoints={waypoints}
          onWaypointClick={toggleWaypointSelect}
          boulders={boulders}
          displayBoulderFilter
          onBoulderClick={toggleBoulderSelect}
          parkings={parkings}
          onParkingClick={toggleParkingSelect}
          onPhotoButtonClick={() => setDisplayGeoCamera(true)}
          onClick={(e) => {
            if (e.latLng) {
switch (currentTool) {
                case 'ROCK':
                  createBoulder({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  break;
                case 'PARKING':
                  createParking({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  break;
                case 'WAYPOINT':
                  createWaypoint({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  break;
                default: break;
              }
}
          }}
        />

        <Show when={() => [device !== 'MOBILE', selectedTrack.quark()] as const}>
          {([, track]) => (
            <TrackFormSlideagainstDesktop
              track={track}
              onClose={() => selectedTrack.select(undefined)}
              onDeleteTrack={() => {
                selectedBoulder()!.tracks.removeQuark(track);
                selectedTrack.select(undefined);
              }}
            />
          )}
        </Show>

        <Show when={() => selectedBoulder.quark()}>
          {(boulder) => {
            if (device === 'MOBILE') {
              return (
                <BoulderBuilderSlideoverMobile
                  boulder={boulder}
                  selectedTrack={selectedTrack}
                  currentImage={currentImage}
                  setCurrentImage={setCurrentImage}
                  onPhotoButtonClick={() => setDisplayGeoCamera(true)}
                  onDrawButtonClick={() => setDisplayDrawer(true)}
                  onClose={() => {
                    selectedTrack.select(undefined);
                    selectedBoulder.select(undefined);
                  }}
                />
              );
            }
            return (
              <BoulderBuilderSlideagainstDesktop
                boulder={boulder}
                topoCreatorId={topo.creatorId}
                selectedTrack={selectedTrack}
                setCurrentImage={setCurrentImage}
                currentImage={currentImage}
                onClose={() => {
                  selectedTrack.select(undefined);
                  selectedBoulder.select(undefined);
                }}
              />
            );
          }}
        </Show>
        <Show when={selectedParking.quark}>
          {(parking) => (
            <ParkingBuilderSlide
              open
              parking={parking}
              onDeleteParking={() => {
                    topo.parkings.removeQuark(parking);
                    selectedParking.select(undefined);
                  }}
              onClose={() => selectedParking.select(undefined)}
            />
              )}
        </Show>
        <Show when={selectedWaypoint.quark}>
          {(waypoint) => (
            <WaypointBuilderSlide
              open
              waypoint={waypoint}
              onDeleteWaypoint={() => {
                    topo.sectors.at(0).waypoints.removeQuark(waypoint);
                    selectedWaypoint.select(undefined);
                  }}
              onClose={() => selectedWaypoint.select(undefined)}
            />
              )}
        </Show>

        <Show when={() => displayModalValidate}>
          <ModalValidateTopo
            topo={quarkTopo}
            onClose={() => setDisplayModalValidate(false)}
          />
        </Show>
        <Show when={() => displayModalDelete}>
          <ModalDeleteTopo
            topo={quarkTopo}
            onClose={() => setDisplayModalDelete(false)}
          />
        </Show>

      </div>

      <Show when={() => displayGeoCamera}>
        <GeoCamera
          onCapture={async (blob, coordinates) => {
              if (blob) {
                const img = await blobToImage(blob);
                setCurrentImage(img);
                if (selectedBoulder()) {
                  const newImages = selectedBoulder()!.images;
                  newImages.push(img);
                  selectedBoulder.quark()!.set({
                    ...selectedBoulder()!,
                    images: newImages,
                  });
                  selectedTrack.select(createTrack(selectedBoulder()!, session.id));
                } else {
                  const newBoulderQuark = createBoulder(coordinates, img);
                  selectedTrack.select(createTrack(newBoulderQuark(), session.id));
                  selectedBoulder.select(newBoulderQuark);
                }
                setDisplayDrawer(true);
              }
            }}
          onClose={() => setDisplayGeoCamera(false)}
        />
      </Show>

      <Show when={() => [(device !== 'MOBILE' || displayDrawer), selectedBoulder(), selectedTrack()] as const}>
        {([, sBoulder, sTrack]) => (
          <Drawer
            image={sBoulder.images.find((img) => img.id === sTrack.lines.lazy().toArray()[0]?.imageId) || currentImage!}
            tracks={sBoulder.tracks}
            selectedTrack={selectedTrack}
            onValidate={() => setDisplayDrawer(false)}
          />
          )}
      </Show>

    </>
  );
};

export default watchDependencies(BuilderMapPage);
