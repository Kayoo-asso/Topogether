import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    BoulderBuilderSlideoverMobile, SectorBuilderSlideoverMobile,
    MapControl, Show,
    Header, InfoFormSlideover, ManagementFormSlideover, TrackFormSlideagainstDesktop,
    BoulderMarkerDropdown, ParkingMarkerDropdown, WaypointMarkerDropdown,
    ModalSubmitTopo, ModalDeleteTopo, GeoCamera, Drawer, LeftbarBuilderDesktop, BoulderBuilderSlideagainstDesktop,
    ParkingBuilderSlide, AccessFormSlideover, WaypointBuilderSlide, ModalRenameSector, ModalDelete, SectorAreaMarkerDropdown, BuilderProgressIndicator,
} from 'components';
import { blobToImage, DeviceContext, sortBoulders, useContextMenu, createTrack, createBoulder, createParking, createWaypoint, createSector, deleteSector, deleteBoulder, deleteParking, deleteWaypoint, toLatLng } from 'helpers';
import { Boulder, GeoCoordinates, Image, MapToolEnum, Parking, Sector, Track, Waypoint, Topo, Profile, Session, isUUID, TopoStatus } from 'types';
import { Quark, QuarkIter, useCreateDerivation, useLazyQuarkyEffect, useQuarkyCallback, useSelectQuark, watchDependencies } from 'helpers/quarky';
import { useRouter } from 'next/router';

interface RootBuilderProps {
    topoQuark: Quark<Topo>,
    session: Session,
}

export const RootBuilder: React.FC<RootBuilderProps> = watchDependencies((props: RootBuilderProps) => {
    const router = useRouter();
    const { b: bId } = router.query; // Get boulder id from url if selected 
    const firstRender = useRef(true);
    const device = useContext(DeviceContext);

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
        if (selectedBoulder()?.id === boulderQuark().id) selectedBoulder.select(undefined);
        else {
            setCurrentImage(boulderQuark().images[0]);
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
    useLazyQuarkyEffect(([boulder]) => {
        if (boulder) router.push({ pathname: window.location.href.split('?')[0], query: { b: boulder.id } }, undefined, { shallow: true });
        else router.push({ pathname: window.location.href.split('?')[0] }, undefined, { shallow: true })
    }, [selectedBoulder]);

    const displayBoulderDropdown = useCallback((e: any, boulderQuark: Quark<Boulder>) => {
        setDropdownPosition({ x: e.domEvent.pageX, y: e.domEvent.pageY });
        boulderRightClicked.select(boulderQuark);
    }, []);
    const displayWaypointDropdown = useCallback((e: any, waypointQuark: Quark<Waypoint>) => {
        setDropdownPosition({ x: e.domEvent.pageX, y: e.domEvent.pageY });
        waypointRightClicked.select(waypointQuark);
    }, []);
    const displayParkingDropdown = useCallback((e: any, parkingQuark: Quark<Parking>) => {
        setDropdownPosition({ x: e.domEvent.pageX, y: e.domEvent.pageY });
        parkingRightClicked.select(parkingQuark);
    }, []);
    const displaySectorDropdown = useCallback((e: any, sectorQuark: Quark<Sector>) => {
        setDropdownPosition({ x: e.domEvent.pageX, y: e.domEvent.pageY });
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
            const newSectorQuark = createSector(props.topoQuark, creatingSector, boulderOrder())
            selectedSector.select(newSectorQuark);
            emptyCreatingSector();
            setDisplayModalSectorRename(true);
        }
    }, [creatingSector]);
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

    const handleGeoCameraCapture = useCallback(async (blob, coordinates) => {
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
                    selectedTrack.select(createTrack(selectedBoulder()!, props.session.id));
                }
                else {
                    const newBoulderQuark = createBoulder(props.topoQuark, coordinates, img);
                    selectedTrack.select(createTrack(newBoulderQuark(), props.session.id));
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
    }, [topo, currentTool, selectedBoulder()]);

    return (
        <>
            <Header
                title={topo.name}
                backLink="/"
                menuOptions={[
                    { value: 'Infos du topo', action: () => setCurrentDisplay('INFO') },
                    { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH') },
                    { value: 'Gestionnaires du spot', action: () => setCurrentDisplay('MANAGEMENT') },
                    { value: 'Valider le topo', action: () => setDisplayModalSubmitTopo(!displayModalSubmitTopo) },
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
                <BuilderProgressIndicator topo={props.topoQuark} />
            </Header>

            <div className="h-content md:h-full relative flex flex-row md:overflow-hidden">
                <LeftbarBuilderDesktop
                    topoQuark={props.topoQuark}
                    boulderOrder={boulderOrder()}
                    selectedBoulder={selectedBoulder}
                    onBoulderSelect={toggleBoulderSelect}
                    onTrackSelect={toggleTrackSelect}
                    onSubmit={() => setDisplayModalSubmitTopo(true)}
                />
                <Show when={() => [device === 'MOBILE', displaySectorSlideover] as const}>
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
                        className={currentDisplay === 'INFO' ? 'z-100' : ''}
                    />
                </Show>
                <Show when={() => displayApproach}>
                    <AccessFormSlideover
                        accesses={topo.accesses}
                        open={displayApproach}
                        onClose={() => setCurrentDisplay('none')}
                        className={currentDisplay === 'APPROACH' ? 'z-100' : ''}
                    />
                </Show>
                <Show when={() => displayManagement}>
                    <ManagementFormSlideover
                        managers={topo.managers}
                        open={displayManagement}
                        onClose={() => setCurrentDisplay('none')}
                        className={currentDisplay === 'MANAGEMENT' ? 'z-100' : ''}
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
                    draggableCursor={currentTool === 'ROCK' ? 'url(/assets/icons/colored/_rock.svg) 16 32, auto'
                        : currentTool === 'SECTOR' ? 'url(/assets/icons/colored/line-point/_line-point-grey.svg), auto'
                            : currentTool === 'PARKING' ? 'url(/assets/icons/colored/_parking.svg), auto'
                                : currentTool === 'WAYPOINT' ? 'url(/assets/icons/colored/_help-round.svg), auto'
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
                    displayPhotoButton
                    onPhotoButtonClick={() => {
                        setCurrentTool('ROCK');
                        setDisplayGeoCamera(true);
                    }}
                    onMapZoomChange={closeDropdown}
                    onClick={handleCreateNewMarker}
                    onMouseMove={handleFreePointCreatingSector}
                    onCreatingSectorPolylineClick={handleCreatingSectorPolylineClick}
                    center={toLatLng(topo.location)}
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
                                topoCreatorId={topo.creator?.id}
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
                        onDelete={() => console.log('delete topo')} //TODO
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