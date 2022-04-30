import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { BoulderMarker, For, Map, ParkingMarker, RoundButton, SatelliteButton, Show, UserMarker, WaypointMarker, TopoMarker, CreatingTopoMarker } from 'components';
import { BoulderFilterOptions, BoulderFilters, MapSearchbarProps, TopoFilterOptions, TopoFilters } from '.';
import { ItemSelectorMobile, MapSearchbar } from '..';
import { Amenities, Boulder, ClimbTechniques, GeoCoordinates, gradeToLightGrade, LightGrade, LightTopo, MapProps, MapToolEnum, Parking, PolyMouseEvent, Position, Sector, Topo, UUID, Waypoint } from 'types';
import { fontainebleauLocation, fromLatLngLiteralFn, googleGetPlace, hasFlag, hasSomeFlags, mergeFlags, toLatLng, TopoCreate } from 'helpers';
import { Quark, QuarkIter, reactKey, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import SectorIcon from 'assets/icons/sector.svg';
import CenterIcon from 'assets/icons/center.svg';

type MapControlProps = React.PropsWithChildren<MapProps & {
    className?: string,
    initialCenter?: Position,
    initialZoom?: number,
    displaySatelliteButton?: boolean,
    displayUserMarker?: boolean,
    currentTool?: MapToolEnum,
    onToolSelect?: (tool: MapToolEnum) => void,
    onPhotoButtonClick?: () => void,
    displaySectorButton?: boolean,
    onSectorButtonClick?: () => void,
    displaySearchbar?: boolean,
    searchbarOptions?: MapSearchbarProps,
    onBoulderResultSelect?: (boulder: Boulder) => void,
    topo?: Quark<Topo>,
    creatingTopo?: Quark<TopoCreate>,
    topos?: LightTopo[],
    topoFilters?: Quark<TopoFilterOptions>,
    topoFiltersDomain?: TopoFilterOptions,
    boulders?: QuarkIter<Quark<Boulder>>,
    bouldersOrder?: Map<UUID, number>,
    selectedBoulder?: SelectQuarkNullable<Boulder>,
    onBoulderClick?: (boulder: Quark<Boulder>) => void,
    onBoulderContextMenu?: (e: Event, boulder: Quark<Boulder>) => void,
    displayBoulderFilter?: boolean,
    parkings?: QuarkIter<Quark<Parking>>,
    selectedParking?: SelectQuarkNullable<Parking>,
    onParkingClick?: (parking: Quark<Parking>) => void,
    onParkingContextMenu?: (e: Event, parking: Quark<Parking>) => void,
    draggableMarkers?: boolean,
    centerOnUser?: boolean
    boundsTo?: GeoCoordinates[],
    onUserMarkerClick?: (pos: google.maps.MapMouseEvent) => void,
    onMapZoomChange?: (zoom: number | undefined) => void,
}>

export const MapControl: React.FC<MapControlProps> = watchDependencies(({
    initialZoom = 8,
    displaySearchbar = true,
    displaySatelliteButton = true,
    displayUserMarker = true,
    displaySectorButton = false,
    displayBoulderFilter = false,
    draggableMarkers = false,
    ...props
}: MapControlProps) => {
    const mapRef = useRef<google.maps.Map>(null);

    const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral>();
    const [satelliteView, setSatelliteView] = useState(false);
    useEffect(() => {
        if (mapRef.current && userPosition && props.centerOnUser) mapRef.current.setCenter(userPosition);
    }, [mapRef.current, props.centerOnUser]);

    const [creatingTopoAlreadyPositioned, setCreatingTopoAlreadyPositioned] = useState(false);
    useEffect(() => {
        if (props.centerOnUser && userPosition && props.creatingTopo && !creatingTopoAlreadyPositioned) {
            props.creatingTopo.set({
                ...props.creatingTopo(),
                location: fromLatLngLiteralFn(userPosition),
            });
            setCreatingTopoAlreadyPositioned(true);
        }
    }, [userPosition, props.centerOnUser, creatingTopoAlreadyPositioned]);

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
        if (mapRef.current && props.initialCenter && !props.center) {
            mapRef.current.setCenter(toLatLng(props.initialCenter));
        }
    // this ensures the position is compared element by element
    }, [...(props.initialCenter || [undefined, undefined])])

    useEffect(() => {
        if(mapRef.current && !props.zoom) mapRef.current.setZoom(initialZoom);
    }, [initialZoom])

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
                            {props.topoFilters && props.topoFiltersDomain &&
                                <div className='mt-5'>
                                    <TopoFilters
                                        domain={props.topoFiltersDomain}
                                        values={props.topoFilters()}
                                        onChange={props.topoFilters.set}
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
                            {props.onPhotoButtonClick &&
                            props.onToolSelect &&
                                <ItemSelectorMobile 
                                    currentTool={props.currentTool}
                                    onToolSelect={props.onToolSelect}
                                    onPhotoButtonClick={props.onPhotoButtonClick}
                                />
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
                    mapTypeId={satelliteView ? 'satellite' : 'roadmap'}
                    className={props.className ? props.className : ''}
                    onZoomChange={() => {
                        if (mapRef.current && props.onMapZoomChange) {
                            props.onMapZoomChange(mapRef.current.getZoom());
                        }
                    }}
                    onLoad={(map) => {
                        if (props.boundsTo && props.boundsTo.length > 1) {
                            const bounds = props.boundsTo;
                            const boundTimer = window.setTimeout(() => {
                                getBoundsTo(bounds);
                                clearTimeout(boundTimer);
                            }, 1);
                        }
                        else if (!props.center) {
                            const initialCenter = props.initialCenter || fontainebleauLocation;
                            map.setCenter(toLatLng(initialCenter));
                        }
                        if (!props.zoom) map.setZoom(initialZoom);
                    }}
                    {...props}
                >
                    {props.children}

                    {/* BELOW: all the stuff we need to delete */}
                    <Show when={() => [props.boulders, props.bouldersOrder] as const}>
                        <For each={() => displayBoulderFilter ? props.boulders!.filter(b => boulderFilter(b())).toArray() : props.boulders!.toArray()}>
                            {(boulder) =>
                                <BoulderMarker
                                    key={reactKey(boulder)}
                                    draggable={draggableMarkers}
                                    boulder={boulder}
                                    boulderOrder={props.bouldersOrder!}
                                    selectedBoulder={props.selectedBoulder}
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
                            onClick={props.onUserMarkerClick}
                        />
                    </Show>
                </Map>
            </Wrapper>
        </div>
    );
});
