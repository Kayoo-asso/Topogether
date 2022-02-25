import React, {
 useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import type { NextPage } from 'next';
import {
  BoulderBuilderSlideoverMobile, SectorBuilderSlideoverMobile,
  MapControl, Show,
  Header, InfoFormSlideover, ManagementFormSlideover, TrackFormSlideagainstDesktop, 
  ModalValidateTopo, ModalDeleteTopo, GeoCamera, Drawer, LeftbarBuilderDesktop, BoulderBuilderSlideagainstDesktop, ParkingBuilderSlide, AccessFormSlideover, WaypointBuilderSlide, BoulderMarkerDropdown, ModalRenameSector, ModalDelete, 
} from 'components';
import { useRouter } from 'next/router';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import {
 blobToImage, defaultImage, DeviceContext, sortBoulders, boulderChanged, sectorChanged, createTrack,
} from 'helpers';
import {
 Boulder, GeoCoordinates, Image, MapToolEnum, Name, Parking, Sector, SectorData, Track, Waypoint,
} from 'types';
import {
 Quark, QuarkArray, QuarkIter, useCreateDerivation, useQuarkyCallback, useSelectQuark, watchDependencies,
} from 'helpers/quarky';
import { v4 } from 'uuid';
import { useContextMenu } from 'helpers/hooks/useContextMenu';
import { api } from 'helpers/services/ApiService';

const BuilderMapPage: NextPage = watchDependencies(() => {
  const session = api.user();
  const router = useRouter();
  const { id } = router.query;
  const device = useContext(DeviceContext);

  const topo = quarkTopo();
  const sectors = useMemo(() => topo.sectors?.quarks(), [topo.sectors]) || new QuarkIter<Quark<Parking>>([]);
  const boulders = useMemo(() => topo.boulders?.quarks(), [topo.boulders]) || new QuarkIter<Quark<Boulder>>([])
  const parkings = useMemo(() => topo.parkings?.quarks(), [topo.parkings]) || new QuarkIter<Quark<Parking>>([]);
  const waypoints = useMemo(() => topo.waypoints?.quarks(), [topo.waypoints]) || new QuarkIter<Quark<Waypoint>>([]);
  const boulderOrder = useCreateDerivation(() => sortBoulders(topo.sectors, topo.lonelyBoulders));

  const [currentTool, setCurrentTool] = useState<MapToolEnum>();
  const [currentImage, setCurrentImage] = useState<Image>(defaultImage);
  const selectedSector = useSelectQuark<Sector>();
  const toDeleteSector = useSelectQuark<Sector>();
  const selectedBoulder = useSelectQuark<Boulder>();
  const toDeleteBoulder = useSelectQuark<Boulder>();
  const selectedTrack = useSelectQuark<Track>();
  const selectedParking = useSelectQuark<Parking>();
  const toDeleteParking = useSelectQuark<Parking>();
  const selectedWaypoint = useSelectQuark<Waypoint>();
  const toDeleteWaypoint = useSelectQuark<Waypoint>();
  const boulderRightClicked = useSelectQuark<Boulder>();

  const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();
  const closeDropdown = useCallback(() => boulderRightClicked.select(undefined), []);
  useContextMenu(() => boulderRightClicked.select(undefined));
  
  const [displaySectorSlideover, setDisplaySectorSlideover] = useState<boolean>(false);
  const [displayGeoCamera, setDisplayGeoCamera] = useState<boolean>(false);
  const [displayDrawer, setDisplayDrawer] = useState<boolean>(false);
  const [displayInfo, setDisplayInfo] = useState<boolean>(false);
  const [displayApproach, setDisplayApproach] = useState<boolean>(false);
  const [displayManagement, setDisplayManagement] = useState<boolean>(false);
  const [currentDisplay, setCurrentDisplay] = useState<'INFO' | 'APPROACH' | 'MANAGEMENT'>();
  useEffect(() => {
    setDisplaySectorSlideover(false);
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

  const [displayModalValidateTopo, setDisplayModalValidateTopo] = useState(false);
  const [displayModalDeleteTopo, setDisplayModalDeleteTopo] = useState(false);

  const [displayModalSectorRename, setDisplayModalSectorRename] = useState(false);
  const toggleSectorSelect = useQuarkyCallback((sectorQuark: Quark<Sector>) => {
    if (selectedSector()?.id === sectorQuark().id)
      selectedSector.select(undefined);
    else selectedSector.select(sectorQuark);
  }, [selectedSector, selectedBoulder]);
  const toggleBoulderSelect = useQuarkyCallback((boulderQuark: Quark<Boulder>) => {
    setDisplaySectorSlideover(false);
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedBoulder()?.id === boulderQuark().id) selectedBoulder.select(undefined);
    else {
      setCurrentImage(boulderQuark().images[0] || defaultImage);
      selectedBoulder.select(boulderQuark);
    }
  }, [selectedBoulder]);
  const toggleTrackSelect = useQuarkyCallback((trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => {
    setDisplaySectorSlideover(false);
    selectedBoulder.select(undefined);
    selectedParking.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedTrack()?.id === trackQuark().id) { selectedTrack.select(undefined); } else {
      selectedBoulder.select(boulderQuark);
      selectedTrack.select(trackQuark);
    }
  }, [selectedTrack]);
  const toggleParkingSelect = useQuarkyCallback((parkingQuark: Quark<Parking>) => {
    setDisplaySectorSlideover(false);
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedWaypoint.select(undefined);
    if (selectedParking()?.id === parkingQuark().id) { selectedParking.select(undefined); } else selectedParking.select(parkingQuark);
  }, [selectedParking]);
  const toggleWaypointSelect = useQuarkyCallback((waypointQuark: Quark<Waypoint>) => {
    setDisplaySectorSlideover(false);
    selectedBoulder.select(undefined);
    selectedTrack.select(undefined);
    selectedParking.select(undefined);
    if (selectedWaypoint()?.id === waypointQuark().id) { selectedWaypoint.select(undefined); } else selectedWaypoint.select(waypointQuark);
  }, [selectedWaypoint]);

  const displayBoulderDropdown = useCallback((e: any, boulderQuark: Quark<Boulder>) => {
    boulderRightClicked.select(boulderQuark);
    setDropdownPosition({ x: e.domEvent.pageX, y: e.domEvent.pageY });
  }, []);

  const [creatingSector, setCreatingSector] = useState<GeoCoordinates[]>([]);
  const [freePointCreatingSector, setFreePointCreatingSector] = useState<GeoCoordinates>();
  const handleCreatingSector = useCallback((location: GeoCoordinates) => {
    setCreatingSector(creatingSector => [...creatingSector, location])
  }, [creatingSector]);
  const emptyCreatingSector = () => {
    setCreatingSector([]);
    setFreePointCreatingSector(undefined);
  }
  const createSector = useCallback(() => {
    if (creatingSector.length > 2) {
      const newSector: SectorData = {
        id: v4(),
        name: 'Nouveau secteur' as Name,
        path: [...creatingSector],
        boulders: []
      };
      topo.sectors.push(newSector);
      sectorChanged(quarkTopo, newSector.id, boulderOrder());

      const newSectorQuark = topo.sectors.quarkAt(-1);
      selectedSector.select(newSectorQuark);
      setDisplayModalSectorRename(true);
      emptyCreatingSector();
    }
  }, [topo, topo.sectors, creatingSector]);
  const deleteSector = useQuarkyCallback((sector) => {
    topo.sectors.removeQuark(sector);
    if (selectedSector.quark() === sector) selectedSector.select(undefined);
  }, []);
  const createBoulder = useCallback((location: GeoCoordinates, image?: Image, selectBoulder = false) => {
    const orderIndex = topo.boulders.length;
    const newBoulder: Boulder = {
      id: v4(),
      name: `Bloc ${orderIndex + 1}` as Name,
      location,
      isHighball: false,
      mustSee: false,
      dangerousDescent: false,
      tracks: new QuarkArray(),
      images: image ? [image] : [],
    };
    topo.boulders.push(newBoulder);
    boulderChanged(quarkTopo, newBoulder.id, newBoulder.location, true);

    const newBoulderQuark = topo.boulders.quarkAt(-1);
    if (selectBoulder) {
      selectedBoulder.select(newBoulderQuark);
      if (image) setCurrentImage(newBoulder.images[0]);
    }
    return newBoulderQuark;
  }, [topo]);
  const deleteBoulder = useQuarkyCallback((boulder) => {
    topo.boulders.removeQuark(boulder);
    if (selectedBoulder.quark() === boulder) selectedBoulder.select(undefined);
  }, []);
  const createParking = useCallback((location: GeoCoordinates, image = undefined, selectParking = false) => {
    const newParking: Parking = {
      id: v4(),
      spaces: 0,
      name: `parking ${topo.parkings ? topo.parkings.length + 1 : '1'}` as Name,
      image: image ? image : [],
      location,
    };
    topo.parkings.push(newParking);
    const newParkingQuark = topo.parkings.quarkAt(-1);
    if (selectParking) selectedParking.select(newParkingQuark);
    return newParkingQuark;
  }, [topo]);
  const deleteParking = useQuarkyCallback((parking) => {
    topo.parkings.removeQuark(parking);
    if (selectedParking.quark() === parking) selectedParking.select(undefined);
  }, []);
  const createWaypoint = useCallback((location: GeoCoordinates, image = undefined, selectWaypoint = false) => {
    const newWaypoint: Waypoint = {
      id: v4(),
      name: `point de repère ${topo.waypoints ? topo.waypoints.length + 1 : '1'}` as Name,
      image: image ? image : [],
      location,
    };
    topo.waypoints.push(newWaypoint);
    const newWaypointQuark = topo.waypoints.quarkAt(-1);
    if (selectWaypoint) selectedWaypoint.select(newWaypointQuark);
    return newWaypointQuark;
  }, [topo]);
  const deleteWaypoint = useQuarkyCallback((waypoint) => {
    topo.waypoints.removeQuark(waypoint);
    if (selectedWaypoint.quark() === waypoint) selectedWaypoint.select(undefined);
  }, []);

  const handleCreateNewMarker = useCallback((e) => {
    if (e.latLng) {
      const loc: GeoCoordinates = [e.latLng.lng(), e.latLng.lat()]
      switch (currentTool) {
        case 'ROCK': createBoulder(loc); break;
        case 'SECTOR': handleCreatingSector(loc); break;
        case 'PARKING': createParking(loc); break;
        case 'WAYPOINT': createWaypoint(loc); break;
        default: break;
      }
    }
  }, [currentTool, createBoulder, createParking, createWaypoint, handleCreatingSector]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        if (creatingSector.length > 0) createSector();
      }
      else if (e.code === 'Escape') {
        if (creatingSector.length > 0) emptyCreatingSector();
        if (currentTool) setCurrentTool(undefined);
        else {
          selectedSector.select(undefined);
          selectedBoulder.select(undefined);
          selectedParking.select(undefined); 
          selectedWaypoint.select(undefined);
        }
      }
      else if (e.code === 'Delete') {
        if (selectedSector()) toDeleteSector.select(selectedSector.quark());
        else if (selectedBoulder()) toDeleteBoulder.select(selectedBoulder.quark());
        else if (selectedParking()) toDeleteParking.select(selectedParking.quark());
        else if (selectedWaypoint()) toDeleteWaypoint.select(selectedWaypoint.quark());
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [creatingSector, currentTool]);

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
          { value: 'Valider le topo', action: () => setDisplayModalValidateTopo(!displayModalValidateTopo) },
          { value: 'Supprimer le topo', action: () => setDisplayModalDeleteTopo(!displayModalDeleteTopo) },
        ]}
        displayMapTools
        MapToolsActivated={!selectedTrack()}
        currentTool={currentTool}
        onRockClick={() => setCurrentTool(currentTool === 'ROCK' ? undefined : 'ROCK')}
        onSectorClick={() => setCurrentTool(currentTool === 'SECTOR' ? undefined : 'SECTOR')}
        onParkingClick={() => setCurrentTool(currentTool === 'PARKING' ? undefined : 'PARKING')}
        onWaypointClick={() => setCurrentTool(currentTool === 'WAYPOINT' ? undefined : 'WAYPOINT')}
      />

      <div className="h-content md:h-full relative flex flex-row md:overflow-hidden">
        <LeftbarBuilderDesktop
          topoQuark={quarkTopo}
          boulderOrder={boulderOrder()}
          selectedBoulder={selectedBoulder}
          onBoulderSelect={toggleBoulderSelect}
          onTrackSelect={toggleTrackSelect}
          onValidate={() => setDisplayModalValidateTopo(true)}
        />
        <Show when={() => [device === 'MOBILE', displaySectorSlideover] as const}>
          {() => (
            <SectorBuilderSlideoverMobile 
              topoQuark={quarkTopo}
              boulderOrder={boulderOrder()}
              selectedBoulder={selectedBoulder}
              onCreateSector={() => setCurrentTool('SECTOR')}
              onBoulderSelect={toggleBoulderSelect}
              onTrackSelect={toggleTrackSelect}
              onClose={() => setDisplaySectorSlideover(false)}
            />
          )}
        </Show>

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
          displaySectorButton
          onSectorButtonClick={() => setDisplaySectorSlideover(true)}
          searchbarOptions={{
              findTopos: false,
              findPlaces: false,
          }}
          draggableCursor={currentTool === 'ROCK' ? 'url(/assets/icons/colored/_rock.svg) 16 32, auto'
                          : currentTool === 'SECTOR' ? 'url(/assets/icons/colored/line-point/_line-point-grey.svg), auto'
                          : currentTool === 'PARKING' ? 'url(/assets/icons/colored/_parking.svg), auto'
                          : currentTool === 'WAYPOINT' ? 'url(/assets/icons/colored/_help-round.svg), auto'
                          : ''}
          draggableMarkers
          topo={quarkTopo}
          creatingSector={freePointCreatingSector ? creatingSector.concat(freePointCreatingSector) : creatingSector}
          onCreatingSectorOriginClick={createSector}
          sectors={sectors}
          selectedSector={selectedSector}    
          onSectorClick={(e, sectorQuark) => {
            if (currentTool) handleCreateNewMarker(e);
            else toggleSectorSelect(sectorQuark);
          }}
          onSectorDragStart={(e, sectorQuark) => selectedSector.select(sectorQuark)}
          boulders={boulders}
          bouldersOrder={boulderOrder()}
          selectedBoulder={selectedBoulder}
          onBoulderClick={toggleBoulderSelect}
          onBoulderContextMenu={displayBoulderDropdown}        
          waypoints={waypoints}
          selectedWaypoint={selectedWaypoint}
          onWaypointClick={toggleWaypointSelect}
          parkings={parkings}
          selectedParking={selectedParking}
          onParkingClick={toggleParkingSelect}
          displayPhotoButton
          onPhotoButtonClick={() => {
            setCurrentTool('ROCK');
            setDisplayGeoCamera(true);
          }}
          onMapZoomChange={closeDropdown}
          onClick={handleCreateNewMarker}
          onMouseMove={(e) => {
            if (creatingSector && creatingSector.length > 0 && e.latLng) {
              setFreePointCreatingSector([e.latLng!.lng(), e.latLng!.lat()]);
            }
          }}
          onCreatingSectorPolylineClick={() => {
            if (freePointCreatingSector)
              handleCreatingSector(freePointCreatingSector);     
          }}
          boundsTo={boulders.toArray().map(b => b().location).concat(parkings.toArray().map(p => p().location))}
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
                    topo.waypoints.removeQuark(waypoint);
                    selectedWaypoint.select(undefined);
                  }}
              onClose={() => selectedWaypoint.select(undefined)}
            />
              )}
        </Show>

        <Show when={() => displayModalValidateTopo}>
          <ModalValidateTopo
            topo={quarkTopo}
            onClose={() => setDisplayModalValidateTopo(false)}
          />
        </Show>
        <Show when={() => displayModalDeleteTopo}>
          <ModalDeleteTopo
            topo={quarkTopo}
            onClose={() => setDisplayModalDeleteTopo(false)}
          />
        </Show>

      </div>

      <Show when={() => displayGeoCamera}>
        <GeoCamera
          currentTool={currentTool || 'ROCK'}
          onChangeTool={(tool) => setCurrentTool(tool)}
          onCapture={async (blob, coordinates) => {
              if (blob) {
                const img = await blobToImage(blob);
                setCurrentImage(img);
                if (currentTool === 'ROCK') {
                  if (selectedBoulder()) {
                    const newImages = selectedBoulder()!.images;
                    newImages.push(img);
                    selectedBoulder.quark()!.set({
                      ...selectedBoulder()!,
                      images: newImages,
                    });
                    selectedTrack.select(createTrack(selectedBoulder()!, session.id));
                  } 
                  else {
                    const newBoulderQuark = createBoulder(coordinates, img);
                    selectedTrack.select(createTrack(newBoulderQuark(), session.id));
                    selectedBoulder.select(newBoulderQuark);
                  }
                  setDisplayDrawer(true);
                }
                else if (currentTool === 'PARKING') {
                  createParking(coordinates, img, true);
                }
                else if (currentTool === 'WAYPOINT') {
                  createWaypoint(coordinates, img, true);
                }
              }
            }}
          onClose={() => setDisplayGeoCamera(false)}
        />
      </Show>

      <Show when={() => boulderRightClicked.quark()}>
          {(quarkBoulder) =>
            <BoulderMarkerDropdown 
              dropdownPosition={dropdownPosition} 
              toggleTrackSelect={toggleTrackSelect} 
              boulder={quarkBoulder} 
              deleteBoulder={() => toDeleteBoulder.select(quarkBoulder)}
            />
          }
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

      <Show when={() => [displayModalSectorRename, selectedSector()] as const}>
        {([, sSector]) => (
          <ModalRenameSector 
            sector={sectors.toArray().find(s => s().id === sSector.id)!}
            onClose={() => setDisplayModalSectorRename(false)}
          />
        )}
      </Show>

      <Show when={() => toDeleteSector.quark()}>
        {(sector) => (
          <ModalDelete
            onDelete={() => deleteSector(sector)}
            onClose={() => toDeleteSector.select(undefined)}
          >
            Êtes-vous sûr de vouloir supprimer le secteur ?
          </ModalDelete>
        )}
      </Show>
      <Show when={() => toDeleteBoulder.quark()}>
        {(boulder) => (
          <ModalDelete
            onDelete={() => deleteBoulder(boulder)}
            onClose={() => toDeleteBoulder.select(undefined)}
          >
            Êtes-vous sûr de vouloir supprimer le bloc et toutes les voies associées ?
          </ModalDelete>
        )}
      </Show>
      <Show when={() => toDeleteParking.quark()}>
        {(parking) => (
          <ModalDelete
            onDelete={() => deleteParking(parking)}
            onClose={() => toDeleteParking.select(undefined)}
          >
            Êtes-vous sûr de vouloir supprimer le parking ?
          </ModalDelete>
        )}
      </Show>
      <Show when={() => toDeleteWaypoint.quark()}>
        {(waypoint) => (
          <ModalDelete
            onDelete={() => deleteWaypoint(waypoint)}
            onClose={() => toDeleteWaypoint.select(undefined)}
          >
            Êtes-vous sûr de vouloir supprimer le point de repère ?
          </ModalDelete>
        )}
      </Show>

    </>
  );
});

export default BuilderMapPage;
