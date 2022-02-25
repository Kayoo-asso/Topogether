import React, { useCallback } from "react";
import { toLatLng, usePolyline } from "helpers";
import { GeoCoordinates, PolygonEventHandlers } from "types";
import { ValidationMarker } from "..";

interface CreatingSectorAreaMarkerProps {
    path: GeoCoordinates[],
    onPolylineClick?: () => void,
    onOriginClick?: () => void,
}

export const CreatingSectorAreaMarker: React.FC<CreatingSectorAreaMarkerProps> = (props: CreatingSectorAreaMarkerProps) => {

    const polylineOptions: google.maps.PolylineOptions = {
        path: props.path.map(p => toLatLng(p)),
        strokeColor: '#04D98B',
        strokeWeight: 2,
    }
    const polylineHandlers: PolygonEventHandlers = {
        onClick: useCallback((e) => props.onPolylineClick && props.onPolylineClick(), [props.path, props.onPolylineClick])
    }
    usePolyline(polylineOptions, polylineHandlers);

    if (props.path.length > 3)
        return (
            <ValidationMarker 
                position={props.path[0]}
                onClick={props.onOriginClick}
            />
        )
    
    return null;
};

CreatingSectorAreaMarker.displayName = "Creating Sector AreaMarker";