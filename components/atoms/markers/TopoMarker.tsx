import React, { useCallback } from "react";
import { markerSize, TopoTypeToColor, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { MarkerEventHandlers, TopoType, LightTopo } from "types";

interface TopoMarkerProps {
    topo: Quark<LightTopo>,
    draggable?: boolean,
    type?: TopoType,
    onClick?: (topo: Quark<LightTopo>) => void,
}

export const TopoMarker: React.FC<TopoMarkerProps> = watchDependencies(({
    draggable = false,
    type = TopoType.Boulder,
    ...props
}: TopoMarkerProps) => {
    const topo = props.topo();
    console.log('render topo marker');
    console.log('/assets/icons/colored/waypoint/_'+TopoTypeToColor(type)+'.svg');
    
    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/waypoint/_'+TopoTypeToColor(type)+'.svg',
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