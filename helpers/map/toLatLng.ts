import { Position } from "types";

export function toLatLng(pos: Position): { lng: number, lat: number } {
    return {
        lng: pos[0],
        lat: pos[1]
    };
}

export function fromLatLng(latLng: { lat: number, lng: number }): Position {
    return [latLng.lng, latLng.lat];
}

export function fromLatLngFn(latLng: google.maps.LatLng): Position {
    return [latLng.lng(), latLng.lat()];
}
export function fromLatLngLiteralFn(latLng: google.maps.LatLngLiteral): Position {
    return [latLng.lng, latLng.lat];
}