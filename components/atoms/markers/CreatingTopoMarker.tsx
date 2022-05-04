import React, { useCallback } from "react";
import { markerSize, toLatLng, TopoCreate, TopoTypeToColor, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { MarkerEventHandlers } from "types";

interface CreatingTopoMarkerProps {
    topo: Quark<TopoCreate>,
    draggable?: boolean,
}

export const CreatingTopoMarker: React.FC<CreatingTopoMarkerProps> = watchDependencies(({
    draggable = false,
    ...props
}: CreatingTopoMarkerProps) => {
    const topo = props.topo();

    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/waypoint/_'+TopoTypeToColor(topo.type)+'.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        zIndex: 10,
        position: toLatLng(topo.location)
    };

    const handlers: MarkerEventHandlers = {
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                props.topo.set({
                    ...topo,
                    location: [e.latLng.lng(), e.latLng.lat()]
                })
            }
        }, [props.topo])
    }
    useMarker(options, handlers);

    return null;
});

CreatingTopoMarker.displayName = "CreatingTopoMarker";