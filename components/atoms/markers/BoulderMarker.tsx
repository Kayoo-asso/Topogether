import React, { useContext, useEffect, useRef, useState } from "react";
import { markerSize } from "helpers";
import { Quark } from "helpers/quarky";
import { Boulder, BoulderData, GeoCoordinates, MapMouseEvent, UUID } from "types";
import { MapContext } from "..";

interface BoulderMarkerProps {
    boulder: Quark<Boulder>,
    onClick?: (boulder: Quark<Boulder>) => void,
}

const icon: google.maps.Icon = {
    url: '/assets/icons/colored/_rock.svg',
    scaledSize: markerSize(30)
};

export const BoulderMarker: React.FC<BoulderMarkerProps> = (props) => {
    const boulder = props.boulder();
    // const [boulder, setBoulder] = useQuark(props.boulder);
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
                position: boulder.location,
            })
        }
    }, [marker, boulder.location])

    useEffect(() => {
        if (marker) {
            // TODO: cleanup using the types from MarkerEventHandlers
            const onClickListener = marker.addListener('click', (e: MapMouseEvent) => props.onClick && props.onClick(props.boulder));
            const onDragEndListener = marker.addListener('dragend', (e: MapMouseEvent) => {
                if (e.latLng) {
                    const newLoc: GeoCoordinates = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    };
                    props.boulder.set({
                        ...boulder,
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