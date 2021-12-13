import { Wrapper } from '@googlemaps/react-wrapper';
import { Button, MapComponent, RoundButton, SatelliteButton } from 'components';
import { fontainebleauLocation } from 'const/global';
import React from 'react';
import { GeoCoordinates } from 'types';
import { MapSearchbar } from '..';

interface MapProps {
    center?: GeoCoordinates,
    zoom?: number,
    displaySearchbar?: boolean,
    displaySatelliteButton?: boolean,
    displayUserCenterButton?: boolean,
    displayPhotoButton?: boolean,
    filters?: any,
    onSearchResultSelect?: () => void,
}

export const Map: React.FC<MapProps> = ({
    center = fontainebleauLocation,
    zoom = 8,
    displaySearchbar = true,
    displaySatelliteButton = true,
    displayUserCenterButton = true,
    displayPhotoButton = true,
    ...props
}: MapProps) => {

    return (
        <div className="flex-1 h-full relative">
            <div className="absolute h-full w-full p-3 grid grid-rows-2">
                <div className="flex z-30">
                    <div className='w-1/2 text-left'>
                        {displaySearchbar &&
                            <MapSearchbar />
                        }
                    </div>
                    <div className='w-1/2 text-right'>
                        {displaySatelliteButton &&
                            <SatelliteButton 
                                onClick={() => {}}
                            />
                        }
                    </div>
                </div>
                
                <div className="flex items-end z-30">
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
                        {displayUserCenterButton &&
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

            <Wrapper apiKey="AIzaSyDoHIGgvyVVi_1_6zVWD4AOQPfHWN7zSkU">
            <MapComponent
                center={center}
                zoom={zoom}
            />
            </Wrapper>
        </div>
    )
}