import React, { useCallback, useEffect } from "react";
import { polygonContains, splitArray, usePolygon } from "helpers";
import { Quark, QuarkIter, watchDependencies } from "helpers/quarky";
import { Boulder, GeoCoordinates, PolygonEventHandlers, Sector, UUID } from "types";

interface SectorAreaMarkerProps {
    sector: Quark<Sector>,
    sectors?: QuarkIter<Quark<Sector>>,
    boulders?: QuarkIter<Quark<Boulder>>,
    draggable?: boolean,
    editable?: boolean,
    onClick?: (sector: Quark<Sector>) => void,
    onMouseMoveOnSector?: (e: any) => void,
}

export const SectorAreaMarker: React.FC<SectorAreaMarkerProps> = watchDependencies(({
    draggable = false,
    editable = false,
    ...props
}: SectorAreaMarkerProps) => {

    const options: google.maps.PolygonOptions = {
        paths: props.sector().path,
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
            props.sector.set(s => ({
                ...s,
                path: newPath
            }));
        }
    }, [props.sector]);

    const updateContainedBoulders = useCallback(() => {
        if (props.boulders && props.sectors) {
            const sector = props.sector();
            const newBoulders: UUID[] = [...sector.boulders];
            const removedBoulders: UUID[] = [];
            
            for (const boulderQuark of props.boulders) {
                const boulder = boulderQuark();
                const isInPolygon = polygonContains(sector.path, boulder.location);
                const isInArray = sector.boulders.includes(boulder.id);
                if (isInPolygon && !isInArray) newBoulders.push(boulder.id);
                else if (!isInPolygon && isInArray) removedBoulders.push(newBoulders.splice(newBoulders.indexOf(boulder.id), 1)[0]);
            }           

            // Get away newBoulders from other sectors & add each removedBoulders to the first other sector that contains it (if it exists)
            const reassignedBoulders: UUID[] = [];
            for (const sectorQuark of props.sectors) {
                const sect = sectorQuark()
                const newBs = [...sect.boulders].filter(id => !newBoulders.includes(id)); // Get away
                if (sect.id !== props.sector().id) {
                    for (const boulderId of removedBoulders) {
                        if (!reassignedBoulders.includes(boulderId)) { // if not already reassigned
                            const boulderQ = props.boulders.toArray().find(b => b().id === boulderId);
                            console.log(boulderQ!().name, polygonContains(sect.path, boulderQ!().location))
                            if (boulderQ && polygonContains(sect.path, boulderQ().location)) {
                                const bId = boulderQ().id
                                newBs.push(bId);
                                reassignedBoulders.push(bId)
                            }
                        }
                    }
                    sectorQuark.set(s => ({
                        ...s,
                        boulders: newBs
                    }))
                }
            }

            // Add newBoulders to this sector
            props.sector.set(s => ({
                ...s,
                boulders: newBoulders
            }));
        }
    }, [props.boulders, props.sector]);

    const handlers: PolygonEventHandlers = {
        onDragStart: useCallback(() => dragging = true, [updatePath]),
        onClick: useCallback(() => props.onClick && props.onClick(props.sector), [props.sector, props.onClick]),
        onMouseMove: useCallback((e) => props.onMouseMoveOnSector && props.onMouseMoveOnSector(e), [props.sector, props.onMouseMoveOnSector]),
        onDragEnd: useCallback(() => { dragging = false; updatePath(); updateContainedBoulders(); }, [updatePath, updateContainedBoulders])
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

SectorAreaMarker.displayName = "SectorAreaMarker";