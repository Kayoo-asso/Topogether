import React, { useCallback, useEffect } from "react";
import { usePolygon } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { GeoCoordinates, PolygonEventHandlers, Sector } from "types";

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
    let polygon: React.MutableRefObject<google.maps.Polygon | undefined>;
    let dragging = false;

    const updatePath = useCallback(() => {
        const newBounds: google.maps.LatLng[] | undefined = polygon.current?.getPath().getArray();
        if (newBounds && !dragging) {
            const newPath: GeoCoordinates[] = newBounds.map(b => ({
                lat: b.lat(),
                lng: b.lng()
            }));
            props.sector.set({
                ...sector,
                path: newPath
            })
        }
    }, [props.sector]);

    const handlers: PolygonEventHandlers = {
        onDragStart: useCallback(() => dragging = true, [updatePath]),
        onClick: useCallback(() => props.onClick && props.onClick(props.sector), [props.sector, props.onClick]),
        onDragEnd: useCallback(() => { dragging = false; updatePath() }, [updatePath])
    }
    polygon = usePolygon(options, handlers);

    useEffect(() => {
        if (polygon.current) {
            const l1 = google.maps.event.addListener(polygon.current.getPath(), 'insert_at', updatePath);
            const l2 = google.maps.event.addListener(polygon.current.getPath(), 'set_at', updatePath);
            const l3 = google.maps.event.addListener(polygon.current.getPath(), 'remove_at', updatePath);
            return () => {
                l1.remove();
                l2.remove();
                l3.remove();
            }
        }
    }, [polygon.current, sector])

    return null;
});

SectorAreaMarker.displayName = "SectorAreaMarker";