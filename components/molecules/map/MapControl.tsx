import React, { useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Map, RoundButton, SatelliteButton } from 'components';
import { MapSearchbarProps } from '.';
import { MapSearchbar } from '..';
import { MapProps, MarkerProps } from 'types';
import { googleGetPlace } from 'helpers';

interface MapControlProps extends MapProps {
  initialZoom?: number,
  displaySearchbar?: boolean,
  displaySatelliteButton?: boolean,
  displayUserMarker?: boolean,
  displayPhotoButton?: boolean,
  boundsToMarkers?: boolean,
  filters?: any,
  searchbarOptions?: MapSearchbarProps,
  className?: string,
  children?: any,
  onSearchResultSelect?: () => void,
  onPhotoButtonClick?: () => void,
  onMapZoomChange?: (zoom: number | undefined) => void,
}

export const MapControl: React.FC<MapControlProps> = ({
  initialZoom = 8,
  displaySearchbar = true,
  displaySatelliteButton = true,
  displayUserMarker = true,
  displayPhotoButton = true,
  boundsToMarkers = false,
  ...props
}: MapControlProps) => {
  const mapRef = useRef<google.maps.Map>(null);
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
  const getBoundsFromMarker = (markers: MarkerProps[]) => {
    if (mapRef.current) {
      const newBounds = new google.maps.LatLngBounds();
      markers.map(marker => {
        if (marker.options?.position && newBounds) {
          newBounds.extend(new google.maps.LatLng(
              marker.options?.position
          ));
        }
      });
      mapRef.current.fitBounds(newBounds);
    }
  }

  return (
    <div className="relative w-full h-full md:flex-1">
      <Wrapper apiKey="AIzaSyDoHIGgvyVVi_1_6zVWD4AOQPfHWN7zSkU" libraries={['places']}>

        <div 
          className="absolute h-full w-full p-3 grid grid-rows-2"
        >
          <div className="flex">
            <div className="w-1/2 text-left">
              {displaySearchbar
                && (
                  <MapSearchbar
                    onResultSelect={async (option) => {
                      const placeDetails = await googleGetPlace(option.value) as google.maps.places.PlaceResult;
                      if (placeDetails.geometry) getBoundsFromSearchbar(placeDetails.geometry);
                    }}
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
                    onClick={props.onPhotoButtonClick}
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
                    onClick={() => { 
                      //TODO
                    }}
                  />
                )}
            </div>
          </div>
        </div>


        <Map
          ref={mapRef}
          center={props.center}
          zoom={initialZoom} 
          mapTypeId={satelliteView ? 'satellite' : 'roadmap'}
          className={props.className}
          onZoomChange={() => {
            if (mapRef.current && props.onMapZoomChange) {
              props.onMapZoomChange(mapRef.current.getZoom());
            }
          }}
          // onLoad={() => {
          //   if (boundsToMarkers && props.children) getBoundsFromMarker(props.children);
          // }}
          {...props}
        />
      </Wrapper>
    </div>
  );
};
