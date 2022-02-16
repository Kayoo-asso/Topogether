import React, { useCallback, useEffect } from "react";
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
        onDragEnd: useCallback(() => updatePath(), [props.sector])
    }
    const polygon = usePolygon(options, handlers);


    const updatePath = useCallback(() => {
        const newPath: GeoCoordinates[] = [];
        const newBounds: google.maps.LatLng[] | undefined = polygon.current?.getPath().getArray();
        if (newBounds) {
            newBounds.map(b => newPath.push({
                lat: b.lat(),
                lng: b.lng()
            }));
            props.sector.set({
                ...sector,
                path: newPath
            })
        }
    }, [polygon.current, sector]);
    useEffect(() => {
        if (polygon.current) {
            google.maps.event.addListener(polygon.current.getPath(), 'insert_at', updatePath);
            google.maps.event.addListener(polygon.current.getPath(), 'set_at', updatePath);
            google.maps.event.addListener(polygon.current.getPath(), 'remove_at', updatePath);
        }
    }, [polygon.current, sector])

    return null;
});

SectorAreaMarker.displayName = "SectorAreaMarker";