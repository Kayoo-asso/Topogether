import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
    BoulderBuilderSlideoverMobile, SectorBuilderSlideoverMobile,
    Show,
    InfoFormSlideover, ManagementFormSlideover, TrackFormSlideagainstDesktop,
    BoulderMarkerDropdown, ParkingMarkerDropdown, WaypointMarkerDropdown,
    Drawer, BoulderBuilderSlideagainstDesktop,
    ParkingBuilderSlide, AccessFormSlideover, WaypointBuilderSlide, SectorAreaMarkerDropdown, BuilderProgressIndicator, BoulderFilterOptions,
} from 'components';
import { sortBoulders, useContextMenu, createTrack, createBoulder, createParking, createWaypoint, createSector, useDevice, computeBuilderProgress, encodeUUID, decodeUUID, deleteTrack, sectorChanged, useModal, staticUrl, toLatLng, useLoader } from 'helpers';
import { Boulder, GeoCoordinates, Image, MapToolEnum, Parking, Sector, Track, Waypoint, Topo, isUUID, TopoStatus, ClimbTechniques } from 'types';
import { Quark, useCreateDerivation, useCreateQuark, useLazyQuarkyEffect, useQuarkyCallback, useSelectQuark, watchDependencies } from 'helpers/quarky';
import { api, sync } from 'helpers/services';
import { useFirstRender } from 'helpers/hooks/useFirstRender';
import { useSession } from "helpers/services";
import { Header } from 'components/layouts/header/Header';
import { LeftbarBuilderDesktop } from 'components/layouts/sidebars/LeftbarBuilder.desktop';
import { BoulderMarker, CreatingSectorAreaMarker, For, isMouseEvent, isPointerEvent, isTouchEvent, ParkingMarker, SectorAreaMarker, WaypointMarker } from 'components/atoms';
import { filterBoulders, MapControl } from 'components/molecules';
import { ModalRenameSector } from 'components/organisms/builder/ModalRenameSector';
import { downloadTopoMap } from 'helpers/map/downloadTopoMap';

interface RootBuilderProps {
    topoQuark: Quark<Topo>,
}

export const RootBuilder: React.FC<RootBuilderProps> = watchDependencies((props: RootBuilderProps) => {
    const router = useRouter();
    const session = useSession()!;
    const { b: bId } = router.query; // Get boulder id from url if selected
    const firstRender = useFirstRender();
    const device = useDevice();

    const [Loader, showLoader] = useLoader();

    const topo = props.topoQuark();
    const sectors = topo.sectors;
    const boulders = topo.boulders;
    const parkings = topo.parkings;
    const waypoints = topo.waypoints;
    const boulderOrder = useCreateDerivation(() => sortBoulders(topo.sectors, topo.lonelyBoulders));

    // TODO: Remove
    // useEffect(() => {
    //     downloadTopoMap(topo);
    // }, []);

    const mapRef = useRef<google.maps.Map>(null);
    const multipleImageInputRef = useRef<HTMLInputElement>(null);
    const [currentTool, setCurrentTool] = useState<MapToolEnum>();
    const [tempCurrentTool, setTempCurrentTool] = useState<MapToolEnum>();
    const [currentImage, setCurrentImage] = useState<Image>();

    const selectedSector = useSelectQuark<Sector>();
    const sectorRightClicked = useSelectQuark<Sector>();

    const [ModalDeleteSector, showModalDeleteSector] = useModal<Quark<Sector>>();

    const selectedBoulder = useSelectQuark<Boulder>();
    const boulderRightClicked = useSelectQuark<Boulder>();
    const [ModalDeleteBoulder, showModalDeleteBoulder] = useModal<Quark<Boulder>>();

    const selectedParking = useSelectQuark<Parking>();
    const parkingRightClicked = useSelectQuark<Parking>();
    const [ModalDeleteParking, showModalDeleteParking] = useModal<Quark<Parking>>();

    const selectedWaypoint = useSelectQuark<Waypoint>();
    const waypointRightClicked = useSelectQuark<Waypoint>();
    const [ModalDeleteWaypoint, showModalDeleteWaypoint] = useModal<Quark<Waypoint>>();

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

    const [ModalSubmitTopo, showModalSubmitTopo] = useModal();
    const [ModalDeleteTopo, showModalDeleteTopo] = useModal();

    const [displayModalSectorRename, setDisplayModalSectorRename] = useState(false);
    const toggleSectorSelect = useQuarkyCallback((sectorQuark: Quark<Sector>) => {
        if (currentTool) return
        const sSector = selectedSector();
        (sSector && sSector.id === sectorQuark().id) ? // if the sector is already selected
            selectedSector.select(undefined) : // we unselect it
            selectedSector.select(sectorQuark); // if not, we select it
    }, [selectedSector, selectedBoulder]);
    const toggleBoulderSelect = useQuarkyCallback((boulderQuark: Quark<Boulder>) => {
        setDisplaySectorSlideover(false);
        selectedSector.select(undefined);
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
                const boulder = boulders.findQuark(b => b.id === expanded);
                if (boulder) toggleBoulderSelect(boulder);
            }
        }
    }
    const toggleTrackSelect = useQuarkyCallback((trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => {
        setDisplaySectorSlideover(false);
        selectedSector.select(undefined);
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
        selectedSector.select(undefined);
        selectedBoulder.select(undefined);
        selectedTrack.select(undefined);
        selectedWaypoint.select(undefined);
        if (selectedParking()?.id === parkingQuark().id) { selectedParking.select(undefined); } else selectedParking.select(parkingQuark);
    }, [selectedParking]);
    const toggleWaypointSelect = useQuarkyCallback((waypointQuark: Quark<Waypoint>) => {
        setDisplaySectorSlideover(false);
        selectedSector.select(undefined);
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

    const handleCreateNewMarker = useCallback((e) => {
        if (e.latLng) {
            const loc: GeoCoordinates = [e.latLng.lng(), e.latLng.lat()];
            switch (currentTool) {
                case 'ROCK': createBoulder(props.topoQuark, loc); break;
                case 'PARKING': createParking(topo, loc); break;
                case 'WAYPOINT': createWaypoint(topo, loc); break;
                // case 'SECTOR' is handled by inserting a CreatingSectorAreaMarker component
                default: break;
            }
        }
    }, [topo, currentTool, createBoulder, createParking, createWaypoint]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') {
                // TODO: change this, we first wish to cancel any ongoing action,
                // then set the current tool to undefined
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
            // TODO : Add a check to know if we are on the map and not in an input or textarea in a form, to avoid deleting items when we just want to delete characters
            // else if (e.code === 'Delete') {
            //     if (selectedSector()) showModalDeleteSector(selectedSector.quark()!);
            //     else if (selectedBoulder()) showModalDeleteBoulder(selectedBoulder.quark()!);
            //     else if (selectedParking()) showModalDeleteParking(selectedParking.quark()!);
            //     else if (selectedWaypoint()) showModalDeleteWaypoint(selectedWaypoint.quark()!);
            // }
            else if (e.code === "Space" && currentTool) {
                setTempCurrentTool(currentTool);
                setCurrentTool(undefined);
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space" && tempCurrentTool) {
                setCurrentTool(tempCurrentTool);
                setTempCurrentTool(undefined);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [currentTool, tempCurrentTool]);

    const handleNewPhoto = useCallback((img: Image, coords: GeoCoordinates) => {
        if (!coords) { console.log("no coords"); return; }
        if (img) {
            setCurrentImage(img);
            if (currentTool === 'PARKING') {
                selectedParking.select(createParking(topo, coords, img));
            }
            else if (currentTool === 'WAYPOINT') {
                selectedWaypoint.select(createWaypoint(topo, coords, img));
            }
            else {
                const sBoulder = selectedBoulder();
                if (sBoulder) {
                    const newImages = sBoulder.images;
                    newImages.push(img);
                    selectedBoulder.quark()!.set(b => ({
                        ...b,
                        images: newImages,
                    }));
                    selectedTrack.select(createTrack(sBoulder, session.id));
                }
                else {
                    const newBoulderQuark = createBoulder(props.topoQuark, coords, img);
                    selectedTrack.select(createTrack(newBoulderQuark(), session.id));
                    selectedBoulder.select(newBoulderQuark);
                }
                setDisplayDrawer(true);
            }
        }
    }, [topo, selectedParking(), selectedWaypoint(), selectedBoulder()]);

    const progress = useCreateDerivation<number>(() => computeBuilderProgress(props.topoQuark), [props.topoQuark]);

    const maxTracks = useCreateDerivation<number>(() => {
        return boulders.toArray().map(b => b.tracks.length).reduce((a, b) => a + b, 0);
    }, [boulders]);
    const defaultBoulderFilterOptions: BoulderFilterOptions = {
        techniques: ClimbTechniques.None,
        tracksRange: [0, maxTracks()],
        gradeRange: [3, 9],
        mustSee: false
    }
    const boulderFilters = useCreateQuark<BoulderFilterOptions>(defaultBoulderFilterOptions);
    useEffect(() => {
        const max = maxTracks();
        if (max !== boulderFilters().tracksRange[1]) {
            boulderFilters.set(opts => ({
                ...opts,
                tracksRange: [opts.tracksRange[0], max]
            }));
        }
    }, [maxTracks()]);

    return (
        <>
            <Header
                title={topo.name}
                backLink="/builder/dashboard"
                onBackClick={displayDrawer ? () => setDisplayDrawer(false) :
                    selectedBoulder() ? () => { selectedTrack.select(undefined); selectedBoulder.select(undefined); } :
                        selectedParking() ? () => selectedParking.select(undefined) :
                            selectedWaypoint() ? () => selectedWaypoint.select(undefined) : undefined
                }
                menuOptions={[
                    { value: 'Infos du topo', action: () => setCurrentDisplay('INFO') },
                    { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH') },
                    { value: 'Gestionnaires du spot', action: () => setCurrentDisplay('MANAGEMENT') },
                    { value: 'Valider le topo', action: () => showModalSubmitTopo() },
                    { value: 'Supprimer le topo', action: () => showModalDeleteTopo() },
                ]}
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
                    onBoulderSelect={(boulderQuark) => {
                        toggleBoulderSelect(boulderQuark);
                        mapRef.current?.setCenter(toLatLng(boulderQuark().location));
                    }}
                    onTrackSelect={toggleTrackSelect}
                    onSubmit={showModalSubmitTopo}
                    activateSubmission={progress() === 100}
                    onRenameSector={(sectorQuark) => {
                        selectedSector.select(sectorQuark);
                        setDisplayModalSectorRename(true);
                    }}
                    onDeleteBoulder={showModalDeleteBoulder}
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
                            onRenameSector={(sectorQuark) => {
                                selectedSector.select(sectorQuark);
                                setDisplayModalSectorRename(true);
                            }}
                            onDeleteBoulder={showModalDeleteBoulder}
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
                    ref={mapRef}
                    initialZoom={16}
                    initialCenter={topo.location}
                    displaySectorButton
                    onSectorButtonClick={() => setDisplaySectorSlideover(true)}
                    searchbarOptions={{
                        findBoulders: true,
                        focusOnOpen: true,
                    }}
                    onBoulderResultSelect={(boulder) => toggleBoulderSelect(boulders.findQuark(b => b.id === boulder.id)!)}
                    currentTool={currentTool}
                    onToolSelect={(tool) => tool === currentTool ? setCurrentTool(undefined) : setCurrentTool(tool)}
                    onNewPhoto={handleNewPhoto}
                    draggableCursor={currentTool === 'ROCK' ? 'url(/assets/icons/colored/_rock.svg) 16 32, auto'
                        : currentTool === 'SECTOR' ? 'url(/assets/icons/colored/line-point/_line-point-grey.svg), auto'
                            : currentTool === 'PARKING' ? 'url(/assets/icons/colored/_parking.svg) 16 30, auto'
                                : currentTool === 'WAYPOINT' ? 'url(/assets/icons/colored/_help-round.svg) 16 30, auto'
                                    : ''}
                    topo={props.topoQuark}
                    boulderFilters={boulderFilters}
                    boulderFiltersDomain={defaultBoulderFilterOptions}
                    onMapZoomChange={closeDropdown}
                    onClick={handleCreateNewMarker}
                    boundsTo={boulders.map(b => b.location).concat(parkings.map(p => p.location)).toArray()}
                >
                    {currentTool === "SECTOR" &&
                        <CreatingSectorAreaMarker
                            onComplete={(path) => {
                                const sector = createSector(props.topoQuark, path, boulderOrder());
                                selectedSector.select(sector);
                                setDisplayModalSectorRename(true);
                                setCurrentTool(undefined);
                            }}
                        />
                    }
                    <For each={() => filterBoulders(boulders.quarks(), boulderFilters())}>
                        {boulder =>
                            <BoulderMarker
                                key={boulder().id}
                                boulder={boulder}
                                boulderOrder={boulderOrder()}
                                selectedBoulder={selectedBoulder}
                                topo={props.topoQuark}
                                onClick={toggleBoulderSelect}
                                onContextMenu={displayBoulderDropdown}
                                draggable
                            />
                        }
                    </For>
                    <For each={() => sectors.quarks().toArray()}>
                        {sector =>
                            <SectorAreaMarker
                                key={sector().id}
                                sector={sector}
                                selected={selectedSector.quark() === sector}
                                // TODO: improve the callbacks
                                // TODO: how to avoid problems with the mousemove event not reaching the map while creating a sector?

                                // Avoid the sector area intercepting clicks if another tool is selected
                                onClick={toggleSectorSelect}
                                onContextMenu={displaySectorDropdown}
                                onDragStart={() => selectedSector.select(sector)}
                                onDragEnd={() => sectorChanged(props.topoQuark, sector().id, boulderOrder())}
                            />
                        }
                    </For>
                    <For each={() => waypoints.quarks().toArray()}>
                        {waypoint =>
                            <WaypointMarker
                                key={waypoint().id}
                                waypoint={waypoint}
                                selected={selectedWaypoint.quark() === waypoint}
                                onClick={toggleWaypointSelect}
                                onContextMenu={displayWaypointDropdown}
                                draggable
                            />
                        }
                    </For>
                    <For each={() => parkings.quarks().toArray()}>
                        {parking =>
                            <ParkingMarker
                                key={parking().id}
                                parking={parking}
                                selected={selectedParking.quark() === parking}
                                onClick={toggleParkingSelect}
                                onContextMenu={displayParkingDropdown}
                                draggable
                            />
                        }
                    </For>
                </MapControl>

                <Show when={() => [device !== 'mobile', selectedTrack.quark()] as const}>
                    {([, track]) => (
                        <TrackFormSlideagainstDesktop
                            track={track}
                            onClose={() => {
                                selectedTrack.select(undefined)
                            }}
                            onDeleteTrack={() => deleteTrack(selectedBoulder()!, track, selectedTrack)}
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
                                    onDrawButtonClick={() => {
                                        setDisplayDrawer(true);
                                    }}
                                    onCreateTrack={() => {
                                        setDisplayDrawer(true);
                                    }}
                                    onBoulderDelete={showModalDeleteBoulder}
                                    onClose={() => {
                                        selectedTrack.select(undefined);
                                        selectedBoulder.select(undefined);
                                    }}
                                />
                            );
                        }
                        return (
                            <BoulderBuilderSlideagainstDesktop
                                ref={multipleImageInputRef}
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

                <ModalSubmitTopo
                    buttonText="Confirmer"
                    imgUrl={staticUrl.defaultProfilePicture}
                    onConfirm={async () => {
                        showLoader();
                        props.topoQuark.set({
                            ...topo,
                            status: TopoStatus.Submitted
                        });
                        await sync.attemptSync();
                        router.push('/builder/dashboard');
                    }}
                >Le topo sera envoyé en validation. Etes-vous sûr de vouloir continuer ?</ModalSubmitTopo>
                <ModalDeleteTopo
                    buttonText="Confirmer"
                    imgUrl={staticUrl.deleteWarning}
                    onConfirm={async () => {
                        showLoader();
                        api.deleteTopo(topo);
                        await sync.attemptSync();
                        router.push('/builder/dashboard');
                    }}
                >Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer ?</ModalDeleteTopo>
            </div>

            {/* <Show when={() => displayGeoCamera}>
                <GeoCamera
                    currentTool={currentTool || 'ROCK'}
                    changeableTool={!selectedBoulder()}
                    onChangeTool={(tool) => setCurrentTool(tool)}
                    onCapture={handleGeoCameraCapture}
                    onClose={() => setDisplayGeoCamera(false)}
                />
            </Show> */}

            <Show when={() => boulderRightClicked.quark()}>
                {(quarkBoulder) =>
                    <BoulderMarkerDropdown
                        position={dropdownPosition}
                        toggleTrackSelect={toggleTrackSelect}
                        boulder={quarkBoulder}
                        multipleImageInputRef={multipleImageInputRef}
                        deleteBoulder={showModalDeleteBoulder}
                        onSelect={() => boulderRightClicked.select(undefined)}
                        onAddImageClick={() => {
                            if (!selectedBoulder() || selectedBoulder()?.id !== quarkBoulder().id) toggleBoulderSelect(quarkBoulder);
                            setTimeout(() => {
                                if (multipleImageInputRef?.current) multipleImageInputRef.current.click();
                            }, 5);
                        }}
                    />
                }
            </Show>

            <Show when={() => sectorRightClicked.quark()}>
                {(quarkSector) =>
                    <SectorAreaMarkerDropdown
                        position={dropdownPosition}
                        sector={quarkSector}
                        deleteSector={showModalDeleteSector}
                        renameSector={() => {
                            selectedSector.select(quarkSector);
                            setDisplayModalSectorRename(true);
                        }}
                        onSelect={() => sectorRightClicked.select(undefined)}
                    />
                }
            </Show>

            <Show when={() => waypointRightClicked.quark()}>
                {(quarkWaypoint) =>
                    <WaypointMarkerDropdown
                        position={dropdownPosition}
                        waypoint={quarkWaypoint}
                        deleteWaypoint={showModalDeleteWaypoint}
                        onSelect={() => waypointRightClicked.select(undefined)}
                    />
                }
            </Show>

            <Show when={() => parkingRightClicked.quark()}>
                {(quarkParking) =>
                    <ParkingMarkerDropdown
                        position={dropdownPosition}
                        parking={quarkParking}
                        deleteParking={showModalDeleteParking}
                        onSelect={() => parkingRightClicked.select(undefined)}
                    />
                }
            </Show>

            <Show when={() => [(device !== 'mobile' || displayDrawer), selectedBoulder(), selectedTrack()] as const}>
                {([, sBoulder, sTrack]) => (
                    <Drawer
                        image={sBoulder.images.find((img) => img.id === sTrack.lines.lazy().toArray()[0]?.imageId) || currentImage!}
                        tracks={sBoulder.tracks}
                        selectedTrack={selectedTrack}
                        open
                        onValidate={() => setDisplayDrawer(false)}
                    />
                )}
            </Show>

            <Show when={() => [displayModalSectorRename, selectedSector()] as const}>
                {([, sSector]) => {
                    return (
                        <ModalRenameSector
                            sector={sectors.findQuark(s => s.id === sSector.id)!}
                            onClose={() => setDisplayModalSectorRename(false)}
                        />
                    )
                }}
            </Show>

            <ModalDeleteSector
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={(sector) => {
                    topo.sectors.removeQuark(sector);
                    if (selectedSector.quark() === sector) selectedSector.select(undefined);
                }}
            >Êtes-vous sûr de vouloir supprimer le secteur ?</ModalDeleteSector>
            <ModalDeleteBoulder
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={(boulder) => {
                    topo.boulders.removeQuark(boulder);
                    if (selectedBoulder.quark() === boulder) selectedBoulder.select(undefined);
                }}
            >Êtes-vous sûr de vouloir supprimer le bloc et toutes les voies associées ?</ModalDeleteBoulder>
            <ModalDeleteParking
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={(parking) => {
                    topo.parkings.removeQuark(parking);
                    if (selectedParking.quark() === parking) selectedParking.select(undefined);
                }}
            >Êtes-vous sûr de vouloir supprimer le parking ?</ModalDeleteParking>
            <ModalDeleteWaypoint
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={(waypoint) => {
                    topo.waypoints.removeQuark(waypoint);
                    if (selectedWaypoint.quark() === waypoint) selectedWaypoint.select(undefined);
                }}
            >Êtes-vous sûr de vouloir supprimer le point de repère ?</ModalDeleteWaypoint>

            <Loader />
        </>
    );
});

RootBuilder.displayName = "RootBuilder";