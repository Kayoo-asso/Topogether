import React, { useCallback, useContext, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Map, RoundButton, SatelliteButton, UserMarker } from 'components';
import { BoulderFilterOptions, BoulderFilters, MapSearchbarProps, TopoFilterOptions, TopoFilters } from '.';
import { ItemSelectorMobile, MapSearchbar } from '..';
import { Boulder, GeoCoordinates, Image, MapProps, MapToolEnum, Position, Topo } from 'types';
import { fontainebleauLocation, googleGetPlace, setReactRef, toLatLng } from 'helpers';
import { Quark, watchDependencies } from 'helpers/quarky';
import SectorIcon from 'assets/icons/sector.svg';
import CenterIcon from 'assets/icons/center.svg';
import { UserPositionContext } from './UserPositionProvider';
import { useGeolocation } from 'helpers/hooks/useGeolocation';

type MapControlProps = React.PropsWithChildren<Omit<MapProps, 'center' | 'zoom'> & {
    className?: string,
    initialCenter?: Position,
    initialZoom?: number,
    displaySatelliteButton?: boolean,
    displayUserMarker?: boolean,
    currentTool?: MapToolEnum,
    onToolSelect?: (tool: MapToolEnum) => void,
    onNewPhoto?: (img: Image, coords: GeoCoordinates) => void,
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
    ...props
}: MapControlProps, parentRef: React.ForwardedRef<google.maps.Map>) => {
    const mapRef = useRef<google.maps.Map>(null);
    const { position } = useContext(UserPositionContext);

    const [coords, setCoords] = useState<GeoCoordinates>();
    useGeolocation({
        onPosChange: (pos) => setCoords([pos.coords.longitude, pos.coords.latitude]),
        onError: useCallback((err) => {
            if (err.code === 3) console.log('Geolocation timed out!');
            else console.log('Geolocation error:', err);
        }, [])
    });

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

    return (
        <div className="relative w-full h-full">
            <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''} libraries={['places']}>

                <div className="absolute h-full w-full">
                    {/* Top left */}
                    <div className='absolute left-0 top-0 m-3 space-y-5 w-full'>
                        {displaySearchbar && (
                            <MapSearchbar
                                boulders={props.topo ? props.topo().boulders.toArray() : undefined}
                                onGoogleResultSelect={async (res) => {
                                    const placeDetails = await googleGetPlace(res.place_id);
                                    if (placeDetails?.geometry) getBoundsFromSearchbar(placeDetails.geometry);
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
                            {props.onNewPhoto && props.onToolSelect && 
                            <ItemSelectorMobile
                                currentTool={props.currentTool}
                                photoActivated={!!coords}
                                onToolSelect={props.onToolSelect}
                                onNewPhoto={(img) => coords && props.onNewPhoto!(img, coords)}
                            />
                        }
                    </div>
                    {/* Bottom right */}
                    <div className='absolute right-0 bottom-0 m-3'>
                        {displayUserMarker && (
                            <RoundButton
                                onClick={() => {
                                    if (position) {
                                        mapRef.current?.panTo(toLatLng(position));
                                    }
                                }}
                            >
                                <CenterIcon className='h-7 w-7 stroke-main fill-main' />
                            </RoundButton>
                        )}
                    </div>
                </div>


                <Map
                    ref={ref => {
                        setReactRef(mapRef, ref)
                        setReactRef(parentRef, ref);
                    }}
                    mapTypeId={satelliteView ? 'satellite' : 'roadmap'}
                    className={props.className ? props.className : ''}
                    onZoomChange={() => {
                        if (mapRef.current && props.onMapZoomChange) {
                            props.onMapZoomChange(mapRef.current.getZoom());
                        }
                    }}
                    onLoad={(map) => {
                        map.setZoom(initialZoom);
                        const locs = props.boundsTo;
                        const initialCenter = props.initialCenter || position;
                        if (initialCenter) {
                            map.setCenter(toLatLng(initialCenter));
                        }
                        else if (locs && locs.length > 1) {
                            const bounds = new google.maps.LatLngBounds();
                            for (const loc of locs) {
                                bounds.extend(toLatLng(loc));
                            }
                            map.fitBounds(bounds);
                        }
                        else {
                            map.setCenter(toLatLng(fontainebleauLocation));
                        }
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
