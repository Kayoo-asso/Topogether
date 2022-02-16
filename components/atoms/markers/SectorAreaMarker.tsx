import React, { useCallback } from "react";
import { useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { MarkerEventHandlers, Sector } from "types";

interface SectorAreaMarkerProps {
    sector: Quark<Sector>,
    draggable?: boolean,
    editable?: boolean,
    onClick?: (sector: Quark<Sector>) => void,
}

export const SectorAreaMarker: React.FC<SectorAreaMarkerProps> = watchDependencies(({
    draggable = false,
    editable = false,
    ...props
}: SectorAreaMarkerProps) => {
    const sector = props.sector();

    const options: google.maps.PolygonOptions = {
        paths: sector.path,
        draggable,
        editable,
        strokeColor: '#04D98B',
        strokeWeight: 2,
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.sector), [props.sector, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            // if (e.latLng) {
            //     props.parking.set({
            //         ...parking,
            //         location: { lat: e.latLng.lat(), lng: e.latLng.lng() }
            //     })
            // }
        }, [props.sector])
    }
    useMarker(options, handlers);

    return null;
});

SectorAreaMarker.displayName = "SectorAreaMarker";