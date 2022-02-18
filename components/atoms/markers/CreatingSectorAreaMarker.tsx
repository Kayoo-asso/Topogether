import React, { useCallback } from "react";
import { markerSize, useMarker, usePolyline } from "helpers";
import { GeoCoordinates, PolygonEventHandlers } from "types";

interface CreatingSectorAreaMarkerProps {
    path: GeoCoordinates[],
    onOriginClick?: () => void,
}

export const CreatingSectorAreaMarker: React.FC<CreatingSectorAreaMarkerProps> = (props: CreatingSectorAreaMarkerProps) => {

    const polylineOptions: google.maps.PolylineOptions = {
        path: props.path,
        strokeColor: '#04D98B',
        strokeWeight: 2,
    }
    const polylineHandlers: PolygonEventHandlers = {}
    usePolyline(polylineOptions, polylineHandlers);


    const firstPointIcon: google.maps.Icon = {
        url: '/assets/icons/colored/_checked.svg',
        scaledSize: markerSize(30),
    }
    const firstPointOptions: google.maps.MarkerOptions = {
        icon: firstPointIcon,
        position: props.path[0],
    };
    const firstPointHandlers: PolygonEventHandlers = {
        onClick: useCallback(() => props.onOriginClick && props.onOriginClick(), [props.path, props.onOriginClick]),
    }
    useMarker(firstPointOptions, firstPointHandlers); 

    
    return null;
};

CreatingSectorAreaMarker.displayName = "CreatingSectorAreaMarker";