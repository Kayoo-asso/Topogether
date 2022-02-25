import React, { useCallback, useEffect, useRef } from "react";
import { sectorChanged, toLatLng, usePolygon } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { GeoCoordinates, PolygonEventHandlers, PolyMouseEvent, Sector, Topo, UUID } from "types";

interface SectorAreaMarkerProps {
    sector: Quark<Sector>,
    selected?: boolean,
    topo?: Quark<Topo>
    boulderOrder?: Map<UUID, number>,
    draggable?: boolean,
    editable?: boolean,
    clickable?: boolean
    onClick?: (e: PolyMouseEvent) => void,
    onDragStart?: (e: PolyMouseEvent) => void,
    onMouseMoveOnSector?: (e: any) => void,
}

export const SectorAreaMarker: React.FC<SectorAreaMarkerProps> = watchDependencies(({
    draggable = false,
    editable = false,
    selected = false,
    clickable = false,
    ...props
}: SectorAreaMarkerProps) => {
    const sector = props.sector();

    const options: google.maps.PolygonOptions = {
        paths: sector.path.map(p => toLatLng(p)),
        draggable,
        editable,
        clickable,
        fillColor: '#04D98B',
        fillOpacity: selected ? 0.4 : 0.2,
        strokeColor: '#04D98B',
        strokeOpacity: selected ? 1 : 0.4,
        strokeWeight: 2,
    };
    let polygon: React.MutableRefObject<google.maps.Polygon | undefined>;
    let dragging = useRef(false);

    const updatePath = useCallback(() => {
        const newBounds: google.maps.LatLng[] | undefined = polygon.current?.getPath().getArray();
        if (newBounds && !dragging.current) {
            const newPath: GeoCoordinates[] = newBounds.map(b => ([b.lng(), b.lat()]));
            props.sector.set(s => ({
                ...s,
                path: newPath
            }));
        }
    }, [props.sector, dragging]);

    const handlers: PolygonEventHandlers = {
        onDragStart: useCallback((e) => { dragging.current = true; if (props.onDragStart) props.onDragStart(e) }, [updatePath]),
        onClick: useCallback((e: PolyMouseEvent) => {
            props.onClick && props.onClick(e)
        }, [props.sector, props.onClick]),
        onMouseMove: useCallback((e) => props.onMouseMoveOnSector && props.onMouseMoveOnSector(e), [props.sector, props.onMouseMoveOnSector]),
        onDragEnd: useCallback(() => { 
            dragging.current = false; 
            updatePath(); 
            if (props.topo && props.boulderOrder) {
                sectorChanged(props.topo, sector.id, props.boulderOrder);
            }
        }, [updatePath, props.topo, sector, props.boulderOrder])
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
    }, [polygon.current, props.sector])

    return null;
});

SectorAreaMarker.displayName = "Sector Area Marker";