import React, { useCallback } from "react";
import { markerSize, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { MarkerEventHandlers, Waypoint } from "types";

interface WaypointMarkerProps {
    waypoint: Quark<Waypoint>,
    draggable?: boolean,
    onClick?: (waypoint: Quark<Waypoint>) => void,
}

const icon: google.maps.Icon = {
    url: '/assets/icons/colored/_rock.svg',
    scaledSize: markerSize(30)
};

export const WaypointMarker: React.FC<WaypointMarkerProps> = watchDependencies(({
    draggable = false,
    ...props
}: WaypointMarkerProps) => {
    const waypoint = props.waypoint();

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: waypoint.location
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.waypoint), [props.waypoint, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                props.waypoint.set({
                    ...waypoint,
                    location: { lat: e.latLng.lat(), lng: e.latLng.lng() }
                })
            }
        }, [props.waypoint])
    }
    useMarker(options, handlers);

    return null;
});