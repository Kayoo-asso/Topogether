import React, { useCallback } from "react";
import { boulderChanged, markerSize, toLatLng, useMarker } from "helpers";
import { Quark, useQuarkyCallback, watchDependencies } from "helpers/quarky";
import { Boulder, GeoCoordinates, MarkerEventHandlers, Topo, UUID } from "types";

interface BoulderMarkerProps {
    boulder: Quark<Boulder>,
    boulderOrder: Map<UUID, number>,
    selected?: boolean,
    topo?: Quark<Topo>,
    draggable?: boolean,
    onClick?: (boulder: Quark<Boulder>) => void,
    onContextMenu?: (e: Event, boulder: Quark<Boulder>) => void
}

export const BoulderMarker: React.FC<BoulderMarkerProps> = watchDependencies(({
    draggable = false,
    selected = false,
    ...props
}: BoulderMarkerProps) => {
    const boulder = props.boulder();

    const icon: google.maps.Icon = {
        url: selected ? '/assets/icons/colored/_rock_bold.svg' : '/assets/icons/colored/_rock.svg',
        scaledSize: markerSize(30),
        labelOrigin: new google.maps.Point(15, 34)
    }

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: toLatLng(boulder.location),
        label: {
            text: (props.boulderOrder.get(boulder.id)! + (process.env.NODE_ENV === 'development' ? '. '+boulder.name : '')).toString(),
            color: '#04D98B',
            fontFamily: 'Poppins',
            fontWeight: selected ? '700' : '500'
        }
    };

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.boulder), [props.boulder, props.onClick]),
        onDragEnd: useQuarkyCallback((e: google.maps.MapMouseEvent) => { 
            if (e.latLng) {
                const loc: GeoCoordinates = [e.latLng.lng(), e.latLng.lat()];
                props.boulder.set({
                    ...boulder,
                    location: loc
                });
                boulderChanged(props.topo!, boulder.id, loc);
            }
        }, [props.topo, boulder]),
        onContextMenu: useCallback((e) => props.onContextMenu && props.onContextMenu(e, props.boulder), [props.boulder, props.onContextMenu]),
        onMouseDown: useCallback((e) => props.onContextMenu && props.onContextMenu(e, props.boulder), [props.boulder, props.onContextMenu]),
    }
    useMarker(options, handlers);

    return null;
});

BoulderMarker.displayName = "BoulderMarker";