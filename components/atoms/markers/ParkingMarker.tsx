import React, { useCallback } from "react";
import { markerSize, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { Parking, MarkerEventHandlers } from "types";

interface ParkingMarkerProps {
    parking: Quark<Parking>,
    draggable?: boolean,
    onClick?: (parking: Quark<Parking>) => void,
}

export const ParkingMarker: React.FC<ParkingMarkerProps> = watchDependencies(({
    draggable = false,
    ...props
}: ParkingMarkerProps) => {
    const parking = props.parking();

    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/_parking.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: parking.location
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.parking), [props.parking, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                props.parking.set({
                    ...parking,
                    location: { lat: e.latLng.lat(), lng: e.latLng.lng() }
                })
            }
        }, [props.parking])
    }
    useMarker(options, handlers);

    return null;
});

ParkingMarker.displayName = "ParkingMarker";