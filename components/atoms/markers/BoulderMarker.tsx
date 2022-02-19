import React, { useCallback } from "react";
import { boulderChanged, markerSize, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, MarkerEventHandlers, Topo, UUID } from "types";

interface BoulderMarkerProps {
    boulder: Quark<Boulder>,
    boulderOrder: Map<UUID, number>,
    topo?: Topo,
    draggable?: boolean,
    onClick?: (boulder: Quark<Boulder>) => void,
    onContextMenu?: (e: any, boulder: Quark<Boulder>) => void
}

export const BoulderMarker: React.FC<BoulderMarkerProps> = watchDependencies(({
    draggable = false,
    ...props
}: BoulderMarkerProps) => {
    const boulder = props.boulder();

    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/_rock.svg',
        scaledSize: markerSize(30),
        labelOrigin: new google.maps.Point(15, 34)
    }

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: boulder.location,
        label: {
            text: (props.boulderOrder.get(boulder.id)! + '. '+boulder.name).toString(),
            color: '#04D98B',
            fontFamily: 'Poppins',
            fontWeight: '500'
        }
    };

    const updatePosition = useCallback((e) => {
        if (e.latLng) {
            props.boulder.set({
                ...boulder,
                location: { lat: e.latLng.lat(), lng: e.latLng.lng() }
            })
        }
    }, [props.boulder])

    // const updateContainingSector = useCallback(() => {
    //     if (props.sectors) {
    //         const boulder = props.boulder();

    //         // Get away this boulder from all sectors
    //         props.sectors.toArray().forEach(sector => sector.set(s => ({
    //                 ...s,
    //                 boulders: [...s.boulders].filter(id => id !== boulder.id)
    //             }))
    //         )

    //         // Put this boulder in the right sector
    //         for (const sectorQuark of props.sectors) {
    //             const sector = sectorQuark();
    //             const isInPolygon = polygonContains(sector.path, boulder.location);
    //             if (isInPolygon) 
    //                 sectorQuark.set(s => ({
    //                     ...s,
    //                     boulders: [...s.boulders, boulder.id],
    //                 }))
    //         }
    //     }
    // }, [props.sectors, props.boulder]);

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.boulder), [props.boulder, props.onClick]),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => { 
            updatePosition(e); 
            if (props.topo) boulderChanged(props.topo, boulder) 
        }, [updatePosition, props.topo, boulder]),
        onContextMenu: useCallback((e) => props.onContextMenu && props.onContextMenu(e, props.boulder), [props.boulder, props.onContextMenu])
    }
    useMarker(options, handlers);

    return null;
});

BoulderMarker.displayName = "BoulderMarker";