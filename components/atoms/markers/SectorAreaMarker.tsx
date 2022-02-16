import React, { useCallback } from "react";
import { useMarker, usePolygon } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { GeoCoordinates, MarkerEventHandlers, PolygonEventHandlers, Sector } from "types";

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
        fillColor: '#04D98B',
        strokeColor: '#04D98B',
        strokeWeight: 2,
    };

    

    const handlers: PolygonEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.sector), [props.sector, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            const newPath: GeoCoordinates[] = [];
            const newBounds: google.maps.LatLng[] | undefined = polygon.current?.getPath().getArray();
            if (newBounds) {
                newBounds.map(b => newPath.push({
                    lat: b.lat(),
                    lng: b.lng()
                }));
                console.log(newPath);
                props.sector.set({
                    ...sector,
                    path: newPath
                })
            }
        }, [props.sector])
    }
    const polygon = usePolygon(options, handlers) as React.MutableRefObject<google.maps.Polygon>;
    google.maps.event.addListener(polygon.current, 'click', function() {
        console.log("0")
        google.maps.event.addListener(polygon.current.getPath(), 'insert_at', function() {
            console.log("1");
        });
        google.maps.event.addListener(polygon.current.getPath(), 'insert_at', function() {
            console.log("ok");
        });
    });

    return null;
});

SectorAreaMarker.displayName = "SectorAreaMarker";