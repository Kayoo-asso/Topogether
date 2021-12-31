import { markerSize, useBoulder, useQuark } from "helpers";
import { quarks } from "helpers";
import { useContext, useEffect, useRef, useState } from "react";
import { GeoCoordinates, MapMouseEvent, UUID } from "types";
import { MapContext } from ".";

interface BoulderMarkerProps {
    boulderId: UUID,
    onClick?: (id: UUID) => void,
}

const icon: google.maps.Icon = {
    url: '/assets/icons/colored/_rock.svg',
    scaledSize: markerSize(30)
};

const BoulderMarker: React.FC<BoulderMarkerProps> = ({
    boulderId,
    onClick
}) => {
    const [boulder, setBoulder] = useBoulder(boulderId);
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
        if (marker && onClick) {
            const onClickListener = marker.addListener('click', onClick);
            const onDragEndListener = marker.addListener('dragend', (e: MapMouseEvent) => {
                if (e.latLng) {
                    const newLoc: GeoCoordinates = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    };
                    setBoulder({
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
    }, [marker, onClick])


    return null;
}

export default BoulderMarker;