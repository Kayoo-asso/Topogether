import { Position } from "types";
import { toLatLng } from "./toLatLng";

export const centerFromLatLngs = (coords: Position[]): Position => {
    const LatLngCoords = coords.map(coord => toLatLng(coord));
    const bounds = new google.maps.LatLngBounds();
    for (const LatLngCoord of LatLngCoords) {
        bounds.extend(LatLngCoord);
    }
    const center = bounds.getCenter();
    return [center.lng(), center.lat()];
}