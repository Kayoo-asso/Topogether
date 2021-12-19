import React, { useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Map, RoundButton, SatelliteButton } from 'components';
import { fontainebleauLocation } from 'const/global';
import { MapSearchbarProps } from '.';
import { MapSearchbar } from '..';
import { MapProps } from 'types';

interface MapControlProps extends MapProps {
  initialZoom?: number,
  displaySearchbar?: boolean,
  displaySatelliteButton?: boolean,
  displayUserMarker?: boolean,
  displayPhotoButton?: boolean,
  filters?: any,
  searchbarOptions?: MapSearchbarProps,
  onSearchResultSelect?: () => void,
}

export const MapControl: React.FC<MapControlProps> = ({
  displaySearchbar = true,
  displaySatelliteButton = true,
  displayUserMarker = true,
  displayPhotoButton = true,
  center = fontainebleauLocation,
  initialZoom = 8,
  ...props
}: MapControlProps) => {
  const mapRef = useRef<google.maps.Map>(null);
  const [satelliteView, setSatelliteView] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);

  return (
    <div className="flex-1 h-full relative">
      <Wrapper apiKey="AIzaSyDoHIGgvyVVi_1_6zVWD4AOQPfHWN7zSkU" libraries={['places']}>

        <div className="absolute h-full w-full p-3 grid grid-rows-2">
          <div className="flex">
            <div className="w-1/2 text-left">
              {displaySearchbar
                && (
                  <MapSearchbar
                    {...props.searchbarOptions}
                  />
                )}
            </div>
            <div className="w-1/2 text-right">
              {displaySatelliteButton
                && (
                  <SatelliteButton
                    onClick={(displaySatellite) => {
                      setSatelliteView(displaySatellite);
                    }}
                  />
                )}
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-1/3 text-left" />
            <div className="w-1/3 text-center">
              {displayPhotoButton
                && (
                  <RoundButton
                    iconName="camera"
                    white={false}
                    buttonSize={80}
                    iconClass="stroke-white"
                    iconSizeClass="h-7 w-7"
                    onClick={() => { }}
                  />
                )}
            </div>
            <div className="w-1/3 text-right">
              {displayUserMarker
                && (
                  <RoundButton
                    iconName="center"
                    iconClass="stroke-main fill-main"
                    iconSizeClass="h-7 w-7"
                    onClick={() => { }}
                  />
                )}
            </div>
          </div>
        </div>


        <Map
          ref={mapRef}
          center={center}
          zoom={zoom}
          {...props}
          mapTypeId={satelliteView ? 'satellite' : 'roadmap'}
          onZoomChange={() => {
            if (mapRef.current) {
              const newZoom = mapRef.current.getZoom();
              newZoom && setZoom(newZoom);
            }
          }}
        />
      </Wrapper>
    </div>
  );
};
