import { MapContext } from "helpers/context";
import { useContext } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export function useCluster(markers: google.maps.Marker[]) {
    const map = useContext(MapContext);    
    const cluster = new MarkerClusterer({ map, markers });
    return cluster;
}