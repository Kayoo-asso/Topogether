import React, { useCallback } from "react";
import { boulderChanged, markerSize, useMarker } from "helpers";
import { Quark, useQuarkyCallback, watchDependencies } from "helpers/quarky";
import { Boulder, GeoCoordinates, MarkerEventHandlers, Topo, UUID } from "types";

// TODO: Why is props.topo optional? Pretty sure a BoulderMarker cannot be shown without a topo being selected
interface BoulderMarkerProps {
    boulder: Quark<Boulder>,
    boulderOrder: Map<UUID, number>,
    topo?: Quark<Topo>,
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

    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(props.boulder), [props.boulder, props.onClick]),
        onDragEnd: useQuarkyCallback((e: google.maps.MapMouseEvent) => { 
            if (e.latLng) {
                const loc: GeoCoordinates = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                };
                props.boulder.set({
                    ...boulder,
                    location: loc
                });
                boulderChanged(props.topo!, boulder.id, loc);
            }
        }, [props.topo, boulder]),
        onContextMenu: useCallback((e) => props.onContextMenu && props.onContextMenu(e, props.boulder), [props.boulder, props.onContextMenu])
    }
    useMarker(options, handlers);

    return null;
});

BoulderMarker.displayName = "BoulderMarker";