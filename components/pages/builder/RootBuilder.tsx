import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    BoulderBuilderSlideoverMobile, SectorBuilderSlideoverMobile,
    MapControl, Show,
    InfoFormSlideover, ManagementFormSlideover, TrackFormSlideagainstDesktop,
    BoulderMarkerDropdown, ParkingMarkerDropdown, WaypointMarkerDropdown,
    ModalSubmitTopo, ModalDeleteTopo, GeoCamera, Drawer, BoulderBuilderSlideagainstDesktop,
    ParkingBuilderSlide, AccessFormSlideover, WaypointBuilderSlide, ModalRenameSector, ModalDelete, SectorAreaMarkerDropdown, BuilderProgressIndicator,
} from 'components';
import { sortBoulders, useContextMenu, createTrack, createBoulder, createParking, createWaypoint, createSector, deleteSector, deleteBoulder, deleteParking, deleteWaypoint, useDevice, computeBuilderProgress, encodeUUID, decodeUUID, deleteTrack } from 'helpers';
import { Boulder, GeoCoordinates, Image, MapToolEnum, Parking, Sector, Track, Waypoint, Topo, isUUID, TopoStatus } from 'types';
import { Quark, QuarkIter, useCreateDerivation, useLazyQuarkyEffect, useQuarkyCallback, useSelectQuark, watchDependencies } from 'helpers/quarky';
import { useRouter } from 'next/router';
import { api, sync } from 'helpers/services';
import { useFirstRender } from 'helpers/hooks/useFirstRender';
import { useSession } from "helpers/services";
import { Header } from 'components/layouts/header/Header';
import { LeftbarBuilderDesktop } from 'components/layouts/sidebars/LeftbarBuilder.desktop';
import { isMouseEvent, isPointerEvent, isTouchEvent } from 'components/atoms';

interface RootBuilderProps {
    topoQuark: Quark<Topo>,
}

export const RootBuilder: React.FC<RootBuilderProps> = watchDependencies((props: RootBuilderProps) => {
    const router = useRouter();
    const session = useSession()!;
    const { b: bId } = router.query; // Get boulder id from url if selected 
    const firstRender = useFirstRender();
    const device = useDevice();

    const topo = props.topoQuark();
    const sectors = useMemo(() => topo.sectors?.quarks(), [topo.sectors]) || new QuarkIter<Quark<Parking>>([]);
    const boulders = useMemo(() => topo.boulders?.quarks(), [topo.boulders]) || new QuarkIter<Quark<Boulder>>([])
    const parkings = useMemo(() => topo.parkings?.quarks(), [topo.parkings]) || new QuarkIter<Quark<Parking>>([]);
    const waypoints = useMemo(() => topo.waypoints?.quarks(), [topo.waypoints]) || new QuarkIter<Quark<Waypoint>>([]);
    const boulderOrder = useCreateDerivation(() => sortBoulders(topo.sectors, topo.lonelyBoulders));

    const [currentTool, setCurrentTool] = useState<MapToolEnum>();
    const [currentImage, setCurrentImage] = useState<Image>();
    const selectedSector = useSelectQuark<Sector>();
    const toDeleteSector = useSelectQuark<Sector>();
    const sectorRightClicked = useSelectQuark<Sector>();

    const selectedBoulder = useSelectQuark<Boulder>();
    const toDeleteBoulder = useSelectQuark<Boulder>();
    const boulderRightClicked = useSelectQuark<Boulder>();

    const selectedParking = useSelectQuark<Parking>();
    const toDeleteParking = useSelectQuark<Parking>();
    const parkingRightClicked = useSelectQuark<Parking>();

    const selectedWaypoint = useSelectQuark<Waypoint>();
    const waypointRightClicked = useSelectQuark<Waypoint>();
    const toDeleteWaypoint = useSelectQuark<Waypoint>();

    const selectedTrack = useSelectQuark<Track>();

    const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();
    const closeDropdown = useCallback(() => {
        boulderRightClicked.select(undefined);
        waypointRightClicked.select(undefined);
        parkingRightClicked.select(undefined);
        sectorRightClicked.select(undefined);
    }, []);
    useContextMenu(closeDropdown);

    const [displaySectorSlideover, setDisplaySectorSlideover] = useState<boolean>(false);
    const [displayGeoCamera, setDisplayGeoCamera] = useState<boolean>(false);
    const [displayDrawer, setDisplayDrawer] = useState<boolean>(false);
    const [displayInfo, setDisplayInfo] = useState<boolean>(false);
    const [displayApproach, setDisplayApproach] = useState<boolean>(false);
    const [displayManagement, setDisplayManagement] = useState<boolean>(false);
    const [currentDisplay, setCurrentDisplay] = useState<'INFO' | 'APPROACH' | 'MANAGEMENT' | 'none'>();
    useEffect(() => {
        if (currentDisplay) {
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
        }
    }, [currentDisplay]);

    const [displayModalSubmitTopo, setDisplayModalSubmitTopo] = useState(false);
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
        if (selectedBoulder.quark() === boulderQuark) {
            selectedBoulder.select(undefined);
        }
        else {
            setCurrentImage(boulderQuark().images[0]);
            selectedBoulder.select(boulderQuark);
        }
    }, [selectedBoulder]);
    // Hack: select boulder from query parameter
    if (firstRender) {
        if (typeof bId === "string") {
            const expanded = decodeUUID(bId);
            if (isUUID(expanded)) {
                const boulder = boulders.find((b) => b().id === expanded)();
                if (boulder) toggleBoulderSelect(boulder);
            }
        }
    }
    const toggleTrackSelect = useQuarkyCallback((trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => {
        setDisplaySectorSlideover(false);
        selectedBoulder.select(undefined);
        selectedParking.select(undefined);
        selectedWaypoint.select(undefined);
        const track = trackQuark();
        if (selectedTrack()?.id === track.id) selectedTrack.select(undefined);
        else {
            selectedBoulder.select(boulderQuark);
            if (track.lines.length > 0) {
                const newImage = boulderQuark().images.find(img => img.id === track.lines.at(0).imageId);
                if (!newImage) throw new Error("Could not find the first image for the selected track!");
                setCurrentImage(newImage);
            }
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
    useLazyQuarkyEffect(([selectedB]) => {
        if (selectedB) router.push({ pathname: window.location.href.split('?')[0], query: { b: encodeUUID(selectedB.id) } }, undefined, { shallow: true });
        else router.push({ pathname: window.location.href.split('?')[0] }, undefined, { shallow: true })
    }, [selectedBoulder]);

    const displayBoulderDropdown = (e: Event, boulderQuark: Quark<Boulder>) => {
        if (isMouseEvent(e) || isPointerEvent(e)) setDropdownPosition({ x: e.pageX, y: e.pageY });
        else if (isTouchEvent(e)) setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
        boulderRightClicked.select(boulderQuark);
    }
    const displayWaypointDropdown = useCallback((e: Event, waypointQuark: Quark<Waypoint>) => {
        if (isMouseEvent(e) || isPointerEvent(e)) setDropdownPosition({ x: e.pageX, y: e.pageY });
        else if (isTouchEvent(e)) setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
        waypointRightClicked.select(waypointQuark);
    }, []);
    const displayParkingDropdown = useCallback((e: Event, parkingQuark: Quark<Parking>) => {
        if (isMouseEvent(e) || isPointerEvent(e)) setDropdownPosition({ x: e.pageX, y: e.pageY });
        else if (isTouchEvent(e)) setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
        parkingRightClicked.select(parkingQuark);
    }, []);
    const displaySectorDropdown = useCallback((e: Event, sectorQuark: Quark<Sector>) => {
        if (isMouseEvent(e) || isPointerEvent(e)) setDropdownPosition({ x: e.pageX, y: e.pageY });
        else if (isTouchEvent(e)) setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
        sectorRightClicked.select(sectorQuark);
    }, []);

    const [creatingSector, setCreatingSector] = useState<GeoCoordinates[]>([]);
    const [freePointCreatingSector, setFreePointCreatingSector] = useState<GeoCoordinates>();
    const handleCreatingSector = useCallback((location: GeoCoordinates) => {
        setCreatingSector(creatingSector => [...creatingSector, location]);
    }, [creatingSector]);
    const handleFreePointCreatingSector = useCallback((e) => {
        if (creatingSector && creatingSector.length > 0 && e.latLng) {
            const loc: GeoCoordinates = [e.latLng.lng(), e.latLng.lat()]
            setFreePointCreatingSector(loc);
        }
    }, [creatingSector]);
    const handleCreatingSectorPolylineClick = useCallback(() => {
        if (freePointCreatingSector) handleCreatingSector(freePointCreatingSector);
    }, [freePointCreatingSector]);
    const handleCreatingSectorOriginClick = useCallback(() => {
        if (creatingSector.length > 2) {
            const newSectorQuark = createSector(props.topoQuark, creatingSector, boulderOrder());
            selectedSector.select(newSectorQuark);
            emptyCreatingSector();
            setDisplayModalSectorRename(true);
        }
    }, [creatingSector, props.topoQuark]);
    const emptyCreatingSector = () => {
        setCreatingSector([]);
        setFreePointCreatingSector(undefined);
    }
    const handleCreateNewMarker = useCallback((e) => {
        if (e.latLng) {
            const loc: GeoCoordinates = [e.latLng.lng(), e.latLng.lat()];
            switch (currentTool) {
                case 'ROCK': createBoulder(props.topoQuark, loc); break;
                case 'SECTOR': handleCreatingSector(loc); break;
                case 'PARKING': createParking(topo, loc); break;
                case 'WAYPOINT': createWaypoint(topo, loc); break;
                default: break;
            }
        }
    }, [topo, currentTool, createBoulder, createParking, createWaypoint, handleCreatingSector]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === 'Enter') handleCreatingSectorOriginClick();
            else if (e.code === 'Escape') {
                if (creatingSector.length > 0) emptyCreatingSector();
                if (currentTool) setCurrentTool(undefined);
                else if ((device !== 'mobile' || displayDrawer) && selectedBoulder() && selectedTrack()) return; //If the Drawer is open, Escape should only deactivate Drawer tools
                else {
                    selectedSector.select(undefined);
                    selectedBoulder.select(undefined);
                    selectedTrack.select(undefined);
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

    const handleGeoCameraCapture = useCallback(async (file: File, coordinates: GeoCoordinates) => {
        if (file) {
            const res = await api.images.upload(file);
            setDisplayGeoCamera(false)
            if (res.type === 'error') return;
            else {
                const img = res.value;
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
                        const newBoulderQuark = createBoulder(props.topoQuark, coordinates, img);
                        selectedTrack.select(createTrack(newBoulderQuark(), session.id));
                        selectedBoulder.select(newBoulderQuark);
                    }
                    setDisplayDrawer(true);
                }
                else if (currentTool === 'PARKING') {
                    selectedParking.select(createParking(topo, coordinates, img));
                }
                else if (currentTool === 'WAYPOINT') {
                    selectedWaypoint.select(createWaypoint(topo, coordinates, img));
                }
            }
        }
    }, [topo, currentTool, selectedBoulder()]);

    const progress = useCreateDerivation<number>(() => computeBuilderProgress(props.topoQuark), [props.topoQuark]);
    
    return (
        <>
            <Header
                title={topo.name}
                backLink="/builder/dashboard"
                menuOptions={[
                    { value: 'Infos du topo', action: () => setCurrentDisplay('INFO') },
                    { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH') },
                    { value: 'Gestionnaires du spot', action: () => setCurrentDisplay('MANAGEMENT') },
                    { value: 'Valider le topo', action: () => setDisplayModalSubmitTopo(!displayModalSubmitTopo), disabled: progress() !== 100 },
                    { value: 'Supprimer le topo', action: () => setDisplayModalDeleteTopo(!displayModalDeleteTopo) },
                ]}
                displayMapTools
                MapToolsActivated={!selectedTrack()}
                currentTool={currentTool}
                onRockClick={() => setCurrentTool(currentTool === 'ROCK' ? undefined : 'ROCK')}
                onSectorClick={() => setCurrentTool(currentTool === 'SECTOR' ? undefined : 'SECTOR')}
                onParkingClick={() => setCurrentTool(currentTool === 'PARKING' ? undefined : 'PARKING')}
                onWaypointClick={() => setCurrentTool(currentTool === 'WAYPOINT' ? undefined : 'WAYPOINT')}
            >
                <BuilderProgressIndicator
                    topo={props.topoQuark}
                    progress={progress()}
                    displayInfosTopo={() => setCurrentDisplay('INFO')}
                    displayInfosApproach={() => setCurrentDisplay('APPROACH')}
                />
            </Header>

            {/* overflow-clip instead of overflow-hidden, so that the Slideagainst can appear off-screen without 
                triggering a shift of content in this div */}
            <div className="h-content md:h-contentPlusShell relative flex flex-row md:overflow-clip">
                <LeftbarBuilderDesktop
                    topoQuark={props.topoQuark}
                    boulderOrder={boulderOrder()}
                    selectedBoulder={selectedBoulder}
                    onBoulderSelect={toggleBoulderSelect}
                    onTrackSelect={toggleTrackSelect}
                    onSubmit={() => setDisplayModalSubmitTopo(true)}
                    activateSubmission={progress() === 100}
                />
                <Show when={() => [device === 'mobile', displaySectorSlideover] as const}>
                    {() => (
                        <SectorBuilderSlideoverMobile
                            topoQuark={props.topoQuark}
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
                        topo={props.topoQuark}
                        open
                        onClose={() => setCurrentDisplay('none')}
                        className={currentDisplay === 'INFO' ? 'z-300' : ''}
                    />
                </Show>
                <Show when={() => displayApproach}>
                    <AccessFormSlideover
                        accesses={topo.accesses}
                        open={displayApproach}
                        onClose={() => setCurrentDisplay('none')}
                        className={currentDisplay === 'APPROACH' ? 'z-300' : ''}
                    />
                </Show>
                <Show when={() => displayManagement}>
                    <ManagementFormSlideover
                        managers={topo.managers}
                        open={displayManagement}
                        onClose={() => setCurrentDisplay('none')}
                        className={currentDisplay === 'MANAGEMENT' ? 'z-300' : ''}
                    />
                </Show>

                <MapControl
                    initialZoom={16}
                    initialCenter={topo.location}
                    displaySectorButton
                    onSectorButtonClick={() => setDisplaySectorSlideover(true)}
                    searchbarOptions={{
                        findBoulders: true,
                        focusOnOpen: true,
                    }}
                    onBoulderResultSelect={(boulder) => toggleBoulderSelect(boulders.find(b => b().id === boulder.id)()!)}
                    currentTool={currentTool}
                    onToolSelect={(tool) => tool === currentTool ? setCurrentTool(undefined) : setCurrentTool(tool)}
                    // onAddButtonClick={() => console.log("add")}
                    onPhotoButtonClick={() => setDisplayGeoCamera(true)}
                    draggableCursor={currentTool === 'ROCK' ? 'url(/assets/icons/colored/_rock.svg) 16 32, auto'
                        : currentTool === 'SECTOR' ? 'url(/assets/icons/colored/line-point/_line-point-grey.svg), auto'
                            : currentTool === 'PARKING' ? 'url(/assets/icons/colored/_parking.svg) 16 30, auto'
                                : currentTool === 'WAYPOINT' ? 'url(/assets/icons/colored/_help-round.svg) 16 30, auto'
                                    : ''}
                    draggableMarkers
                    topo={props.topoQuark}
                    creatingSector={freePointCreatingSector ? creatingSector.concat([freePointCreatingSector]) : creatingSector}
                    onCreatingSectorOriginClick={handleCreatingSectorOriginClick}
                    sectors={sectors}
                    selectedSector={selectedSector}
                    onSectorClick={(e, sectorQuark) => {
                        if (currentTool) handleCreateNewMarker(e);
                        else toggleSectorSelect(sectorQuark);
                    }}
                    onSectorContextMenu={displaySectorDropdown}
                    onSectorDragStart={(e, sectorQuark) => selectedSector.select(sectorQuark)}
                    boulders={boulders}
                    bouldersOrder={boulderOrder()}
                    selectedBoulder={selectedBoulder}
                    onBoulderClick={toggleBoulderSelect}
                    onBoulderContextMenu={displayBoulderDropdown}
                    waypoints={waypoints}
                    selectedWaypoint={selectedWaypoint}
                    onWaypointClick={toggleWaypointSelect}
                    onWaypointContextMenu={displayWaypointDropdown}
                    parkings={parkings}
                    selectedParking={selectedParking}
                    onParkingClick={toggleParkingSelect}
                    onParkingContextMenu={displayParkingDropdown}
                    onMapZoomChange={closeDropdown}
                    onClick={handleCreateNewMarker}
                    onMouseMove={handleFreePointCreatingSector}
                    onCreatingSectorPolylineClick={handleCreatingSectorPolylineClick}
                    boundsTo={boulders.toArray().map(b => b().location).concat(parkings.toArray().map(p => p().location))}
                />

                <Show when={() => [device !== 'mobile', selectedTrack.quark()] as const}>
                    {([, track]) => (
                        <TrackFormSlideagainstDesktop
                            track={track}
                            onClose={() => {
                                selectedTrack.select(undefined)
                            }}
                            onDeleteTrack={() => {
                                deleteTrack(selectedBoulder()!, track, selectedTrack);
                            }}
                        />
                    )}
                </Show>

                <Show when={() => selectedBoulder.quark()}>
                    {(boulder) => {
                        if (device === 'mobile') {
                            return (
                                <BoulderBuilderSlideoverMobile
                                    boulder={boulder}
                                    topo={props.topoQuark}
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
                                topo={props.topoQuark}
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

                <Show when={() => displayModalSubmitTopo}>
                    <ModalSubmitTopo
                        onSubmit={() => {
                            props.topoQuark.set({
                                ...topo,
                                status: TopoStatus.Submitted
                            });
                            router.push('/builder/dashboard');
                        }}
                        onClose={() => setDisplayModalSubmitTopo(false)}
                    />
                </Show>
                <Show when={() => displayModalDeleteTopo}>
                    <ModalDeleteTopo
                        onDelete={async () => {
                            api.deleteTopo(topo);
                            await sync.attemptSync();
                            router.push('/builder/dashboard');
                        }}
                        onClose={() => setDisplayModalDeleteTopo(false)}
                    />
                </Show>

            </div>

            <Show when={() => displayGeoCamera}>
                <GeoCamera
                    currentTool={currentTool || 'ROCK'}
                    onChangeTool={(tool) => setCurrentTool(tool)}
                    onCapture={handleGeoCameraCapture}
                    onClose={() => setDisplayGeoCamera(false)}
                />
            </Show>

            <Show when={() => boulderRightClicked.quark()}>
                {(quarkBoulder) =>
                    <BoulderMarkerDropdown
                        position={dropdownPosition}
                        toggleTrackSelect={toggleTrackSelect}
                        boulder={quarkBoulder}
                        deleteBoulder={() => toDeleteBoulder.select(quarkBoulder)}
                    />
                }
            </Show>

            <Show when={() => sectorRightClicked.quark()}>
                {(quarkSector) =>
                    <SectorAreaMarkerDropdown
                        position={dropdownPosition}
                        sector={quarkSector}
                        deleteSector={() => toDeleteSector.select(quarkSector)}
                        renameSector={() => {
                            selectedSector.select(quarkSector);
                            setDisplayModalSectorRename(true);
                        }}
                    />
                }
            </Show>

            <Show when={() => waypointRightClicked.quark()}>
                {(quarkWaypoint) =>
                    <WaypointMarkerDropdown
                        position={dropdownPosition}
                        waypoint={quarkWaypoint}
                        deleteWaypoint={() => toDeleteWaypoint.select(quarkWaypoint)}
                    />
                }
            </Show>

            <Show when={() => parkingRightClicked.quark()}>
                {(quarkParking) =>
                    <ParkingMarkerDropdown
                        position={dropdownPosition}
                        parking={quarkParking}
                        deleteParking={() => toDeleteParking.select(quarkParking)}
                    />
                }
            </Show>

            <Show when={() => [(device !== 'mobile' || displayDrawer), selectedBoulder(), selectedTrack()] as const}>
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
                {([, sSector]) => {
                    return (
                        <ModalRenameSector
                            sector={sectors.toArray().find(s => s().id === sSector.id)!}
                            onClose={() => setDisplayModalSectorRename(false)}
                        />
                    )
                }}
            </Show>

            <Show when={() => toDeleteSector.quark()}>
                {(sector) => (
                    <ModalDelete
                        onDelete={() => deleteSector(props.topoQuark, sector, selectedSector)}
                        onClose={() => toDeleteSector.select(undefined)}
                    >
                        Êtes-vous sûr de vouloir supprimer le secteur ?
                    </ModalDelete>
                )}
            </Show>
            <Show when={() => toDeleteBoulder.quark()}>
                {(boulder) => (
                    <ModalDelete
                        onDelete={() => deleteBoulder(props.topoQuark, boulder, selectedBoulder)}
                        onClose={() => toDeleteBoulder.select(undefined)}
                    >
                        Êtes-vous sûr de vouloir supprimer le bloc et toutes les voies associées ?
                    </ModalDelete>
                )}
            </Show>
            <Show when={() => toDeleteParking.quark()}>
                {(parking) => (
                    <ModalDelete
                        onDelete={() => deleteParking(topo, parking, selectedParking)}
                        onClose={() => toDeleteParking.select(undefined)}
                    >
                        Êtes-vous sûr de vouloir supprimer le parking ?
                    </ModalDelete>
                )}
            </Show>
            <Show when={() => toDeleteWaypoint.quark()}>
                {(waypoint) => (
                    <ModalDelete
                        onDelete={() => deleteWaypoint(topo, waypoint, selectedWaypoint)}
                        onClose={() => toDeleteWaypoint.select(undefined)}
                    >
                        Êtes-vous sûr de vouloir supprimer le point de repère ?
                    </ModalDelete>
                )}
            </Show>

        </>
    );
});

RootBuilder.displayName = "RootBuilder";