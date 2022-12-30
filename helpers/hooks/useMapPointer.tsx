import { useMap } from "components/openlayers";
import { MapBrowserEvent } from "ol";
import { Coordinate } from "ol/coordinate";
import { useEffect, useState } from "react";

export const useMapPointerCoordinates = () => {
    const [coords, setCoords] = useState<Coordinate>();
    const map = useMap();

    useEffect(() => {
        const updatePosition = (e: MapBrowserEvent<MouseEvent>) => {
            setCoords(e.coordinate);
        }
        map.on('pointermove', updatePosition);
        return () => map.un('pointermove', updatePosition);
    }, [map]);

    return coords;
}