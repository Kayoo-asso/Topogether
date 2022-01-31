import React, { useCallback } from "react";
import { markerSize, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, MarkerEventHandlers } from "types";

interface BoulderMarkerProps {
    boulder: Quark<Boulder>,
    draggable?: boolean,
    onClick?: (boulder: Quark<Boulder>) => void,
}

export const BoulderMarker: React.FC<BoulderMarkerProps> = watchDependencies(({
    draggable = false,
    ...props
}: BoulderMarkerProps) => {
    const boulder = props.boulder();

    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/_rock.svg',
        scaledSize: markerSize(30),
    }

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: boulder.location
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.boulder), [props.boulder, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                props.boulder.set({
                    ...boulder,
                    location: { lat: e.latLng.lat(), lng: e.latLng.lng() }
                })
            }
        }, [props.boulder])
    }
    useMarker(options, handlers);

    return null;
});

BoulderMarker.displayName = "BoulderMarker";