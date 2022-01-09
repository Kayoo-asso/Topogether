import React, { useContext, useEffect, useRef, useState } from "react";
import { markerSize } from "helpers";
import { Quark } from "helpers/quarky";
import { GeoCoordinates, MapMouseEvent, Topo } from "types";
import { MapContext } from "..";

interface TopoMarkerProps {
    topo: Quark<Topo>,
    onClick?: (topo: Quark<Topo>) => void,
}

const icon: google.maps.Icon = {
    url: '/assets/icons/colored/_waypoint.svg',
    scaledSize: markerSize(30)
};

export const TopoMarker: React.FC<TopoMarkerProps> = (props) => {
    const topo = props.topo();
    const [marker, setMarker] = useState<google.maps.Marker>();
    const map = useContext(MapContext);
    const listeners = useRef<google.maps.MapsEventListener[]>([]);

    useEffect(() => {
        if (!marker) {
            const m = new google.maps.Marker({
                map
            });
            setMarker(m);
        }
        return () => {
            if (marker) {
                marker.setMap(null);
            }
        }
    }, [map]);

    useEffect(() => {
        if (marker) {
            marker.setOptions({
                map,
                icon,
                draggable: true,
                position: topo.location,
            })
        }
    }, [marker, topo.location])

    useEffect(() => {
        if (marker) {
            // TODO: cleanup using the types from MarkerEventHandlers
            const onClickListener = marker.addListener('click', (e: MapMouseEvent) => props.onClick && props.onClick(props.topo));
            const onDragEndListener = marker.addListener('dragend', (e: MapMouseEvent) => {
                if (e.latLng) {
                    const newLoc: GeoCoordinates = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    };
                    props.topo.set({
                        ...topo,
                        location: newLoc
                    });
                }
            });

            listeners.current = [onClickListener, onDragEndListener];
        }

        return () => {
            for (const listener of listeners.current) {
                listener.remove();
            }
            listeners.current = [];
        }
    }, [marker, props.onClick])


    return null;
}