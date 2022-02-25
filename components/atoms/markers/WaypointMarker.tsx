import React, { useCallback } from "react";
import { markerSize, toLatLng, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { MarkerEventHandlers, Waypoint } from "types";

interface WaypointMarkerProps {
    waypoint: Quark<Waypoint>,
    draggable?: boolean,
    selected?: boolean,
    onClick?: (waypoint: Quark<Waypoint>) => void,
}

export const WaypointMarker: React.FC<WaypointMarkerProps> = watchDependencies(({
    draggable = false,
    selected = false,
    ...props
}: WaypointMarkerProps) => {
    const waypoint = props.waypoint();

    const icon: google.maps.Icon = {
        url: selected ? '/assets/icons/colored/_help-round_bold.svg' : '/assets/icons/colored/_help-round.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: toLatLng(waypoint.location)
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.waypoint), [props.waypoint, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                props.waypoint.set({
                    ...waypoint,
                    location: [e.latLng.lng(), e.latLng.lat()]
                })
            }
        }, [props.waypoint])
    }
    useMarker(options, handlers);

    return null;
});

WaypointMarker.displayName = "WaypointMarker";