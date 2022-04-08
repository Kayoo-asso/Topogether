import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { BoulderMarker, CreatingSectorAreaMarker, For, Map, ParkingMarker, RoundButton, SatelliteButton, SectorAreaMarker, Show, UserMarker, WaypointMarker, TopoMarker, CreatingTopoMarker } from 'components';
import { BoulderFilterOptions, BoulderFilters, MapSearchbarProps, TopoFilterOptions, TopoFilters } from '.';
import { MapSearchbar } from '..';
import { Amenities, Boulder, ClimbTechniques, GeoCoordinates, gradeToLightGrade, LightGrade, LightTopo, MapProps, Parking, PolyMouseEvent, Sector, Topo, UUID, Waypoint } from 'types';
import { googleGetPlace, hasFlag, hasSomeFlags, mergeFlags, toLatLng, TopoCreate } from 'helpers';
import { Quark, QuarkIter, reactKey, SelectQuarkNullable } from 'helpers/quarky';
import SectorIcon from 'assets/icons/sector.svg';
import CameraIcon from 'assets/icons/camera.svg';
import CenterIcon from 'assets/icons/center.svg';

interface MapControlProps extends MapProps {
    className?: string,
    initialZoom?: number,
    displaySatelliteButton?: boolean,
    displayUserMarker?: boolean,
    displayPhotoButton?: boolean,
    onPhotoButtonClick?: () => void,
    displaySectorButton?: boolean,
    onSectorButtonClick?: () => void,
    displaySearchbar?: boolean,
    searchbarOptions?: MapSearchbarProps,
    onBoulderResultSelect?: (boulder: Boulder) => void,
    topo?: Quark<Topo>,
    creatingTopo?: Quark<TopoCreate>,
    topos?: LightTopo[],
    displayTopoFilter?: boolean,
    onTopoClick?: (topo: LightTopo) => void,
    creatingSector?: GeoCoordinates[],
    onCreatingSectorOriginClick?: () => void,
    onCreatingSectorPolylineClick?: () => void,
    sectors?: QuarkIter<Quark<Sector>>,
    selectedSector?: SelectQuarkNullable<Sector>,
    onSectorClick?: (e: PolyMouseEvent, sector: Quark<Sector>) => void,
    onSectorDragStart?: (e: PolyMouseEvent, sector: Quark<Sector>) => void,
    onSectorContextMenu?: (e: Event, boulder: Quark<Sector>) => void,
    boulders?: QuarkIter<Quark<Boulder>>,
    bouldersOrder?: Map<UUID, number>,
    selectedBoulder?: SelectQuarkNullable<Boulder>,
    onBoulderClick?: (boulder: Quark<Boulder>) => void,
    onBoulderContextMenu?: (e: Event, boulder: Quark<Boulder>) => void,
    displayBoulderFilter?: boolean,
    waypoints?: QuarkIter<Quark<Waypoint>>,
    selectedWaypoint?: SelectQuarkNullable<Waypoint>,
    onWaypointClick?: (waypoint: Quark<Waypoint>) => void,
    onWaypointContextMenu?: (e: Event, waypoint: Quark<Waypoint>) => void,
    parkings?: QuarkIter<Quark<Parking>>,
    selectedParking?: SelectQuarkNullable<Parking>,
    onParkingClick?: (parking: Quark<Parking>) => void,
    onParkingContextMenu?: (e: Event, parking: Quark<Parking>) => void,
    draggableMarkers?: boolean,
    boundsTo?: GeoCoordinates[],
    onMapZoomChange?: (zoom: number | undefined) => void,
}

export const MapControl: React.FC<MapControlProps> = ({
    initialZoom = 8,
    displaySearchbar = true,
    displaySatelliteButton = true,
    displayUserMarker = true,
    displayPhotoButton = false,
    displaySectorButton = false,
    displayTopoFilter = false,
    displayBoulderFilter = false,
    draggableMarkers = false,
    ...props
}: MapControlProps) => {
    const mapRef = useRef<google.maps.Map>(null);

    const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral>();
    const [satelliteView, setSatelliteView] = useState(false);
    const maxBoulders = (props.topos && props.topos.length > 0) ? Math.max(...props.topos.map(t => t.nbBoulders)) : 1;

    const defaultTopoFilterOptions: TopoFilterOptions = {
        types: [],
        boulderRange: [0, maxBoulders],
        gradeRange: [3, 9],
        adaptedToChildren: false,
    };
    const [topoFilterOptions, setTopoFilterOptions] = useState<TopoFilterOptions>(defaultTopoFilterOptions);
    const maxTracks = (props.boulders && props.boulders.toArray().length > 0) ? Math.max(...props.boulders.map(b => b().tracks.length).toArray()) : 1;
    const defaultBoulderFilterOptions: BoulderFilterOptions = {
        techniques: ClimbTechniques.None,
        tracksRange: [0, maxTracks],
        gradeRange: [3, 9],
        mustSee: false
    }
    const [boulderFilterOptions, setBoulderFilterOptions] = useState<BoulderFilterOptions>(defaultBoulderFilterOptions);

    const boulderFilter = (boulder: Boulder) => {
        const boulderTechniques = mergeFlags(boulder.tracks.toArray().map(track => track.techniques).filter(tech => !!tech) as ClimbTechniques[]);

        if (boulderFilterOptions.techniques !== ClimbTechniques.None && !hasSomeFlags(boulderFilterOptions.techniques, boulderTechniques)) {
            return false;
        }

        if (boulder.tracks.length < boulderFilterOptions.tracksRange[0] || boulder.tracks.length > boulderFilterOptions.tracksRange[1]) {
            return false;
        }

        if (boulderFilterOptions.gradeRange[0] !== 3 || boulderFilterOptions.gradeRange[1] !== 9) {
            const boulderGrades: LightGrade[] = boulder.tracks.toArray().map(track => gradeToLightGrade(track.grade));
            const foundBouldersAtGrade = boulderGrades.some(grade => grade >= boulderFilterOptions.gradeRange[0] && grade <= boulderFilterOptions.gradeRange[1]);

            if (!foundBouldersAtGrade) {
                return false;
            }
        }
        return boulderFilterOptions.mustSee ? boulder.mustSee : true;
    }

    const topoFilter = (topo: LightTopo) => {
        if (topoFilterOptions.types.length && !topoFilterOptions.types.includes(topo.type!)) {
            return false;
        }
        if (topo.nbBoulders < topoFilterOptions.boulderRange[0] || topo.nbBoulders > topoFilterOptions.boulderRange[1]) {
            return false;
        }
        if (topoFilterOptions.gradeRange[0] !== 3 || topoFilterOptions.gradeRange[1] !== 9) {
            const foundBouldersAtGrade = Object.entries(topo.grades || {}).some(([grade, count]) =>
                Number(grade) >= topoFilterOptions.gradeRange[0] && Number(grade) <= topoFilterOptions.gradeRange[1] && count !== 0);

            if (!foundBouldersAtGrade) {
                return false;
            }
        }
        return topoFilterOptions.adaptedToChildren ? hasFlag(topo.amenities, Amenities.AdaptedToChildren) : true;
    }

    const getBoundsFromSearchbar = (geometry: google.maps.places.PlaceGeometry) => {
        if (mapRef.current) {
            const newBounds = new google.maps.LatLngBounds();
            if (geometry.viewport) newBounds.union(geometry.viewport);
            else if (geometry.location) newBounds.extend(geometry.location);
            else return;
            mapRef.current.fitBounds(newBounds);
        }
    }
    const getBoundsTo = (locations: GeoCoordinates[]) => {
        if (mapRef.current) {
            const newBounds = new google.maps.LatLngBounds();
            if (newBounds) {
                locations.forEach(loc => newBounds.extend(new google.maps.LatLng(toLatLng(loc))));
            }
            mapRef.current.fitBounds(newBounds);
        }
    }
    useEffect(() => {
        if (props.boundsTo && props.boundsTo.length > 1) {
            const bounds = props.boundsTo;
            window.setTimeout(() => {
                getBoundsTo(bounds);
            }, 1)
        }
    }, []);

    return (
        <div className="relative w-full h-full">
            <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''} libraries={['places']}>

                <div className="absolute h-full w-full p-3 flex flex-col justify-between">
                    <div className="flex">
                        <span className="w-1/2 text-left">
                            {displaySearchbar && (
                                <MapSearchbar
                                    boulders={props.topo ? props.topo().boulders.toArray() : undefined}
                                    onGoogleResultSelect={async (res) => {
                                        const placeDetails = await googleGetPlace(res.place_id) as google.maps.places.PlaceResult;
                                        if (placeDetails.geometry) getBoundsFromSearchbar(placeDetails.geometry);
                                    }}
                                    onBoulderResultSelect={props.onBoulderResultSelect}
                                    {...props.searchbarOptions}
                                />
                            )}
                            {displayTopoFilter &&
                                <div className='mt-5'>
                                    <TopoFilters
                                        options={defaultTopoFilterOptions}
                                        values={topoFilterOptions}
                                        onChange={setTopoFilterOptions}
                                    />
                                </div>
                            }
                            {displayBoulderFilter &&
                                <div className='mt-5'>
                                    <BoulderFilters
                                        options={defaultBoulderFilterOptions}
                                        values={boulderFilterOptions}
                                        onChange={setBoulderFilterOptions}
                                    />
                                </div>
                            }
                        </span>
                        <div className="w-1/2 text-right">
                            {displaySatelliteButton && (
                                <SatelliteButton
                                    onClick={(displaySatellite) => setSatelliteView(displaySatellite)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className='flex items-center'>
                            {displaySectorButton &&
                                <RoundButton
                                    className='z-10 md:hidden'
                                    onClick={props.onSectorButtonClick}
                                >
                                    <SectorIcon className='h-7 w-7 stroke-main fill-main' />
                                </RoundButton>
                            }
                        </div>
                        <div className='flex items-center'>
                            {displayPhotoButton &&
                                <RoundButton
                                    className='z-10 md:hidden'
                                    white={false}
                                    buttonSize={80}
                                    onClick={props.onPhotoButtonClick}
                                >
                                    <CameraIcon className='stroke-white h-7 w-7' />
                                </RoundButton>
                            }
                        </div>
                        <div className='flex items-center'>
                            {displayUserMarker && userPosition && (
                                <RoundButton
                                    onClick={() => {
                                        mapRef.current?.panTo(userPosition);
                                    }}
                                >
                                    <CenterIcon className='h-7 w-7 stroke-main fill-main' />
                                </RoundButton>
                            )}
                        </div>
                    </div>
                </div>


                <Map
                    ref={mapRef}
                    zoom={initialZoom}
                    mapTypeId={satelliteView ? 'satellite' : 'roadmap'}
                    className={props.className ? props.className : ''}
                    onZoomChange={() => {
                        if (mapRef.current && props.onMapZoomChange) {
                            props.onMapZoomChange(mapRef.current.getZoom());
                        }
                    }}
                    {...props}
                >
                    <Show when={() => props.creatingSector && props.creatingSector.length > 0}>
                        <CreatingSectorAreaMarker
                            path={props.creatingSector!}
                            onPolylineClick={props.onCreatingSectorPolylineClick}
                            onOriginClick={props.onCreatingSectorOriginClick}
                        />
                    </Show>
                    <Show when={() => props.sectors}>
                        <For each={() => props.sectors!.toArray()}>
                            {(sector) =>
                                <SectorAreaMarker
                                    key={reactKey(sector)}
                                    sector={sector}
                                    selected={props.selectedSector ? props.selectedSector()?.id === sector().id : false}
                                    clickable={!props.draggableCursor}
                                    topo={props.topo}
                                    boulderOrder={props.bouldersOrder}
                                    draggable={draggableMarkers}
                                    editable={draggableMarkers}
                                    onClick={(e) => props.onSectorClick && props.onSectorClick(e, sector)}
                                    onDragStart={(e) => props.onSectorDragStart && props.onSectorDragStart(e, sector)}
                                    onMouseMoveOnSector={props.onMouseMove}
                                    onContextMenu={props.onSectorContextMenu}
                                />
                            }
                        </For>
                    </Show>
                    <Show when={() => props.waypoints}>
                        <For each={() => props.waypoints!.toArray()}>
                            {(waypoint) =>
                                <WaypointMarker
                                    key={reactKey(waypoint)}
                                    draggable={draggableMarkers}
                                    waypoint={waypoint}
                                    selected={props.selectedWaypoint ? props.selectedWaypoint()?.id === waypoint().id : false}
                                    onClick={props.onWaypointClick}
                                    onContextMenu={props.onWaypointContextMenu}
                                />
                            }
                        </For>
                    </Show>
                    <Show when={() => [props.boulders, props.bouldersOrder] as const}>
                        <For each={() => displayBoulderFilter ? props.boulders!.filter(b => boulderFilter(b())).toArray() : props.boulders!.toArray()}>
                            {(boulder) =>
                                <BoulderMarker
                                    key={reactKey(boulder)}
                                    draggable={draggableMarkers}
                                    boulder={boulder}
                                    boulderOrder={props.bouldersOrder!}
                                    selected={props.selectedBoulder ? props.selectedBoulder()?.id === boulder().id : false}
                                    topo={props.topo}
                                    onClick={props.onBoulderClick}
                                    onContextMenu={props.onBoulderContextMenu}
                                />
                            }
                        </For>
                    </Show>
                    <Show when={() => props.parkings}>
                        <For each={() => props.parkings!.toArray()}>
                            {(parking) =>
                                <ParkingMarker
                                    key={reactKey(parking)}
                                    draggable={draggableMarkers}
                                    parking={parking}
                                    selected={props.selectedParking ? props.selectedParking()?.id === parking().id : false}
                                    onClick={props.onParkingClick}
                                    onContextMenu={props.onParkingContextMenu}
                                />
                            }
                        </For>
                    </Show>
                    <Show when={() => props.topos}>
                        <For each={() => props.topos!.filter(t => topoFilter(t))}>
                            {(topo) =>
                                <TopoMarker
                                    key={topo.id}
                                    draggable={draggableMarkers}
                                    topo={topo}
                                    onClick={props.onTopoClick}
                                />
                            }
                        </For>
                    </Show>
                    <Show when={() => props.creatingTopo}>
                        {(creatingTopo) =>
                            <CreatingTopoMarker
                                draggable={draggableMarkers}
                                topo={creatingTopo}
                            />
                        }
                    </Show>
                    <Show when={() => displayUserMarker}>
                        <UserMarker
                            onUserPosChange={setUserPosition}
                        />
                    </Show>
                </Map>
            </Wrapper>
        </div>
    );
};
