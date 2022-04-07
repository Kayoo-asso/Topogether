import React, { useCallback } from "react";
import { markerSize, toLatLng, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { Parking, MarkerEventHandlers } from "types";

interface ParkingMarkerProps {
    parking: Quark<Parking>,
    selected?: boolean,
    draggable?: boolean,
    onClick?: (parking: Quark<Parking>) => void,
    onContextMenu?: (e: Event, parking: Quark<Parking>) => void,
}

export const ParkingMarker: React.FC<ParkingMarkerProps> = watchDependencies(({
    draggable = false,
    selected = false,
    ...props
}: ParkingMarkerProps) => {
    const parking = props.parking();

    const icon: google.maps.Icon = {
        url: selected ? '/assets/icons/colored/_parking_bold.svg' : '/assets/icons/colored/_parking.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: toLatLng(parking.location)
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.parking), [props.parking, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                props.parking.set({
                    ...parking,
                    location: [e.latLng.lng(), e.latLng.lat()]
                })
            }
        }, [props.parking]),
        onContextMenu: useCallback((e) => props.onContextMenu && props.onContextMenu(e, props.parking), [props.parking, props.onContextMenu]),
        onMouseDown: useCallback((e) => props.onContextMenu && props.onContextMenu(e, props.parking), [props.parking, props.onContextMenu]),
    }
    useMarker(options, handlers);

    return null;
});

ParkingMarker.displayName = "ParkingMarker";