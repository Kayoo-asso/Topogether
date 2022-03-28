import React, { useCallback } from "react";
import { markerSize, toLatLng, TopoCreate, TopoTypeToColor, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { MarkerEventHandlers, TopoType } from "types";

interface CreatingTopoMarkerProps {
    topo: Quark<TopoCreate>,
    draggable?: boolean,
    type?: TopoType,
}

export const CreatingTopoMarker: React.FC<CreatingTopoMarkerProps> = watchDependencies(({
    draggable = false,
    type = TopoType.Boulder,
    ...props
}: CreatingTopoMarkerProps) => {
    const topo = props.topo();
    
    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/waypoint/_'+TopoTypeToColor(type)+'.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
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