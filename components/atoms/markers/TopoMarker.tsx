import React, { useCallback } from "react";
import { markerSize, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo, MarkerEventHandlers, TopoType } from "types";

interface TopoMarkerProps {
    topo: Quark<Topo>,
    draggable?: boolean,
    type?: TopoType,
    onClick?: (topo: Quark<Topo>) => void,
}

export const TopoMarker: React.FC<TopoMarkerProps> = watchDependencies(({
    draggable = false,
    type = TopoType.Boulder,
    ...props
}: TopoMarkerProps) => {
    const topo = props.topo();
    
    const color = type === TopoType.Boulder ?
    'main' : TopoType.Cliff ?
    'third' : TopoType.DeepWater ?
    'grade-5' : TopoType.Multipitch ?
    'third-highlight' : TopoType.Artificial ?
    'dark' : 'grey-light';
    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/waypoint/_'+color+'.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: topo.location
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.topo), [props.topo, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                props.topo.set({
                    ...topo,
                    location: { lat: e.latLng.lat(), lng: e.latLng.lng() }
                })
            }
        }, [props.topo])
    }
    useMarker(options, handlers);

    return null;
});