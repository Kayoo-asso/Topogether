import { Wrapper } from '@googlemaps/react-wrapper';
import { MapComponent, RoundButton, SatelliteButton } from 'components';
import { fontainebleauLocation } from 'const/global';
import React, { useState } from 'react';
import { GeoCoordinates, MarkerProps } from 'types';
import { MapSearchbarProps } from '.';
import { MapSearchbar } from '..';

type Size = {
    width: number,
    height: number,
    equals: () => boolean,
}

interface MapProps {
    center?: GeoCoordinates,
    zoom?: number,
    displaySearchbar?: boolean,
    displaySatelliteButton?: boolean,
    displayUserMarker?: boolean,
    displayPhotoButton?: boolean,
    filters?: any,
    searchbarOptions?: MapSearchbarProps,
    markers: MarkerProps[],
    onSearchResultSelect?: () => void,
}

export const Map: React.FC<MapProps> = ({
    center = fontainebleauLocation,
    zoom = 8,
    displaySearchbar = true,
    displaySatelliteButton = true,
    displayUserMarker = true,
    displayPhotoButton = true,
    ...props
}: MapProps) => {
    const [satelliteView, setSatelliteView] = useState(false);

    return (
        <div className="flex-1 h-full relative">
            <Wrapper apiKey="AIzaSyDoHIGgvyVVi_1_6zVWD4AOQPfHWN7zSkU" libraries={['places']}>

                <div className="absolute h-full w-full p-3 grid grid-rows-2">
                    <div className="flex">
                        <div className='w-1/2 text-left'>
                            {displaySearchbar &&
                                <MapSearchbar 
                                    {...props.searchbarOptions}
                                />
                            }
                        </div>
                        <div className='w-1/2 text-right'>
                            {displaySatelliteButton &&
                                <SatelliteButton 
                                    onClick={(displaySatellite) => {
                                        setSatelliteView(displaySatellite);
                                    }}
                                />
                            }
                        </div>
                    </div>
                    
                    <div className="flex items-end">
                        <div className="w-1/3 text-left">
                            
                        </div>
                        <div className="w-1/3 text-center">
                            {displayPhotoButton &&
                                <RoundButton 
                                    iconName='camera'
                                    white={false}                            
                                    buttonSize={80}
                                    iconClass='stroke-white'
                                    iconSizeClass='h-7 w-7'
                                    onClick={() => {}}
                                />
                            }
                        </div>
                        <div className="w-1/3 text-right">
                            {displayUserMarker &&
                                <RoundButton 
                                    iconName='center'
                                    iconClass='stroke-main fill-main'
                                    iconSizeClass='h-7 w-7'
                                    onClick={() => {}}
                                />
                            }
                        </div>
                    </div>
                </div>

            
                <MapComponent
                    center={center}
                    zoom={zoom}
                    mapTypeId={satelliteView ? 'satellite' : 'roadmap'}
                    markers={props.markers}
                />

            </Wrapper>
        </div>
    )
}