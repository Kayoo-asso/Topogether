import React, { useEffect, useRef, useState } from 'react';
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
  onSearchResultSelect?: () => void,
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
  const [zoom, setZoom] = useState(initialZoom);

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
      console.log("bounds");
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
    <div className="flex-1 h-full relative">
      <Wrapper apiKey="AIzaSyDoHIGgvyVVi_1_6zVWD4AOQPfHWN7zSkU" libraries={['places']}>

        <div className="absolute h-full w-full p-3 grid grid-rows-2">
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
          center={props.center}
          zoom={zoom} 
          mapTypeId={satelliteView ? 'satellite' : 'roadmap'}
          onZoomChange={() => {
            if (mapRef.current) {
              const newZoom = mapRef.current.getZoom();
              newZoom && setZoom(newZoom);
            }
          }}
          onLoad={() => {
            if (boundsToMarkers && props.markers) getBoundsFromMarker(props.markers);
          }}
          {...props}
        />
      </Wrapper>
    </div>
  );
};
