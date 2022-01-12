import React, { useContext, useEffect, useRef, useState } from "react";
import { markerSize } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { GeoCoordinates, MapMouseEvent, Parking } from "types";
import { MapContext } from "..";

interface ParkingMarkerProps {
    parking: Quark<Parking>,
    onClick?: (parking: Quark<Parking>) => void,
}

const icon: google.maps.Icon = {
    url: '/assets/icons/colored/_parking.svg',
    scaledSize: markerSize(30)
};

export const ParkingMarker: React.FC<ParkingMarkerProps> = watchDependencies((props: ParkingMarkerProps) => {
    const parking = props.parking();
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
                position: parking.location,
            })
        }
    }, [marker, parking.location])

    useEffect(() => {
        if (marker) {
            // TODO: cleanup using the types from MarkerEventHandlers
            const onClickListener = marker.addListener('click', (e: MapMouseEvent) => props.onClick && props.onClick(props.parking));
            const onDragEndListener = marker.addListener('dragend', (e: MapMouseEvent) => {
                if (e.latLng) {
                    const newLoc: GeoCoordinates = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    };
                    props.parking.set({
                        ...parking,
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
});