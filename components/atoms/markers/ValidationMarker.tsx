import React, { useCallback } from "react";
import { markerSize, toLatLng, useMarker } from "helpers";
import { GeoCoordinates, PolygonEventHandlers } from "types";

interface ValidationMarkerProps {
    position: GeoCoordinates,
    onClick?: () => void,
}

export const ValidationMarker: React.FC<ValidationMarkerProps> = (props: ValidationMarkerProps) => {

    const firstPointOptions: google.maps.MarkerOptions = {
        position: toLatLng(props.position),
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: '#04D98B',
            fillOpacity: 1,
            strokeWeight: 0,
        },
    };
    const firstPointHandlers: PolygonEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(), [props.position, props.onClick]),
    }
    useMarker(firstPointOptions, firstPointHandlers);

    const checkIcon: google.maps.Icon = {
        url: '/assets/icons/colored/_checked.svg',
        scaledSize: markerSize(16),
        anchor: new google.maps.Point(8, 8),
    }
    const checkOptions: google.maps.MarkerOptions = {
        icon: checkIcon,
        position: toLatLng(props.position),
    };
    const checkHandlers: PolygonEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(), [props.position, props.onClick]),
    }
    useMarker(checkOptions, checkHandlers); 

    return null;
};

ValidationMarker.displayName = "BoulderMarker";