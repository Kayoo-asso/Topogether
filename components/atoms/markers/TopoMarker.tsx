import React, { useCallback } from "react";
import { markerSize, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo, MarkerEventHandlers } from "types";

interface TopoMarkerProps {
    topo: Quark<Topo>,
    draggable?: boolean,
    onClick?: (topo: Quark<Topo>) => void,
}

const icon: google.maps.Icon = {
    url: '/assets/icons/colored/_rock.svg',
    scaledSize: markerSize(30)
};

export const TopoMarker: React.FC<TopoMarkerProps> = watchDependencies(({
    draggable = false,
    ...props
}: TopoMarkerProps) => {
    const topo = props.topo();

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