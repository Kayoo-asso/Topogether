import React, { useCallback } from "react";
import { markerSize, toLatLng, TopoTypeToColor, useMarker } from "helpers";
import { MarkerEventHandlers, TopoType, LightTopo } from "types";

interface TopoMarkerProps {
    topo: LightTopo,
    type?: TopoType,
    onClick?: (topo: LightTopo) => void,
}

export const TopoMarker: React.FC<TopoMarkerProps> = (props: TopoMarkerProps) => {
    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/waypoint/_'+TopoTypeToColor(props.topo.type)+'.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable: false,
        position: toLatLng(props.topo.location),
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.topo), [props.topo, props.onClick]),
    }
    useMarker(options, handlers);

    return null;
};

TopoMarker.displayName = "TopoMarker";