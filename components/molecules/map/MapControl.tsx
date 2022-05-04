import React, { useContext, useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { BoulderMarker, For, Map, RoundButton, SatelliteButton, Show, UserMarker } from 'components';
import { BoulderFilterOptions, BoulderFilters, MapSearchbarProps, TopoFilterOptions, TopoFilters } from '.';
import { ItemSelectorMobile, MapSearchbar } from '..';
import { Boulder, ClimbTechniques, GeoCoordinates, gradeToLightGrade, LightGrade, MapProps, MapToolEnum, Position, Topo, UUID } from 'types';
import { googleGetPlace, hasSomeFlags, mergeFlags, toLatLng } from 'helpers';
import { Quark, QuarkIter, reactKey, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import SectorIcon from 'assets/icons/sector.svg';
import CenterIcon from 'assets/icons/center.svg';
import { UserPositionContext } from './UserPositionProvider';

type MapControlProps = React.PropsWithChildren<Omit<MapProps, 'center' | 'zoom'> & {
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
    topoFilters?: Quark<TopoFilterOptions>,
    topoFiltersDomain?: TopoFilterOptions,
    boulderFilters?: Quark<BoulderFilterOptions>
    boulderFiltersDomain?: BoulderFilterOptions,
    boundsTo?: Iterable<GeoCoordinates>,
    onUserMarkerClick?: (pos: google.maps.MapMouseEvent) => void,
    onMapZoomChange?: (zoom: number | undefined) => void,
}>

export const MapControl: React.FC<MapControlProps> = watchDependencies(({
    initialZoom = 8,
    displaySearchbar = true,
    displaySatelliteButton = true,
    displayUserMarker = true,
    displaySectorButton = false,
    ...props
}: MapControlProps) => {
    const mapRef = useRef<google.maps.Map>(null);
    const { position } = useContext(UserPositionContext);

    const [satelliteView, setSatelliteView] = useState(false);

    const getBoundsFromSearchbar = (geometry: google.maps.places.PlaceGeometry) => {
        if (mapRef.current) {
            const newBounds = new google.maps.LatLngBounds();
            if (geometry.viewport) newBounds.union(geometry.viewport);
            else if (geometry.location) newBounds.extend(geometry.location);
            else return;
            mapRef.current.fitBounds(newBounds);
        }
    }
    const getBoundsTo = (locations: Iterable<GeoCoordinates>) => {
        if (mapRef.current) {
            const newBounds = new google.maps.LatLngBounds();
            for (const loc of locations) {
                newBounds.extend(toLatLng(loc));
            }
            mapRef.current.fitBounds(newBounds);
        }
    }
    useEffect(() => {
        const initialCenter = props.initialCenter || position;
        if (mapRef.current) {
            mapRef.current.setCenter(toLatLng(initialCenter));
        }
        // this ensures the position is compared element by element
    }, [...(props.initialCenter || [undefined, undefined])])

    useEffect(() => {
        if (mapRef.current) mapRef.current.setZoom(initialZoom);
    }, [initialZoom])

    return (
        <div className="relative w-full h-full">
            <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''} libraries={['places']}>

                <div className="absolute h-full w-full">
                    {/* Top left */}
                    <div className='absolute left-0 top-0 m-3 space-y-5'>
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
                            <TopoFilters
                                domain={props.topoFiltersDomain}
                                values={props.topoFilters()}
                                onChange={props.topoFilters.set}
                            />
                        }
                        {props.boulderFilters && props.boulderFiltersDomain &&
                            <BoulderFilters
                                domain={props.boulderFiltersDomain}
                                values={props.boulderFilters()}
                                onChange={props.boulderFilters.set}
                            />
                        }
                    </div>
                    {/* Top right */}
                    <div className='absolute right-0 top-0 m-3'>
                        {displaySatelliteButton && (
                            <SatelliteButton
                                onClick={(displaySatellite) => setSatelliteView(displaySatellite)}
                            />
                        )}
                    </div>

                    {/* Bottom left */}
                    <div className='absolute bottom-0 left-0 m-3'>
                        {displaySectorButton &&
                            <RoundButton
                                className='z-10 md:hidden'
                                onClick={props.onSectorButtonClick}
                            >
                                <SectorIcon className='h-7 w-7 stroke-main fill-main' />
                            </RoundButton>
                        }
                    </div>

                    {/* Bottom center */}
                    <div className='absolute bottom-0 w-full flex justify-center my-3'>
                        {props.onPhotoButtonClick &&
                            props.onToolSelect &&
                            <ItemSelectorMobile
                                currentTool={props.currentTool}
                                onToolSelect={props.onToolSelect}
                                onPhotoButtonClick={props.onPhotoButtonClick}
                            />
                        }
                    </div>
                    {/* Bottom right */}
                    <div className='absolute right-0 bottom-0 m-3'>
                        {displayUserMarker && (
                            <RoundButton
                                onClick={() => {
                                    mapRef.current?.panTo(toLatLng(position));
                                }}
                            >
                                <CenterIcon className='h-7 w-7 stroke-main fill-main' />
                            </RoundButton>
                        )}
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
                        let bounds;
                        if (props.boundsTo) {
                            const locations = props.boundsTo;
                            bounds = new google.maps.LatLngBounds();
                            for (const loc of locations) {
                                bounds.extend(toLatLng(loc));
                            }
                        }
                        if (bounds && !bounds.isEmpty()) {
                            map.fitBounds(bounds);
                        }
                        else {
                            const initialCenter = props.initialCenter || position;
                            map.setCenter(toLatLng(initialCenter));
                        }
                        map.setZoom(initialZoom);
                    }}
                    {...props}
                >
                    {props.children}

                    {displayUserMarker &&
                        <UserMarker
                            onClick={props.onUserMarkerClick}
                        />
                    }
                </Map>
            </Wrapper >
        </div >
    );
});
