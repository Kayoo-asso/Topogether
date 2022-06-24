import { MapContext } from "helpers/context";
import { useContext } from "react";
import { Cluster, MarkerClusterer } from "@googlemaps/markerclusterer";
import { markerSize } from "helpers/markerSize";

export function useCluster(markers: google.maps.Marker[]) {
    const map = useContext(MapContext);

    // const clusterMarkerIcon:  google.maps.Icon = {
    //     url: '/assets/icons/colored/_rock_bold.svg',
    //     scaledSize: markerSize(50),
    //     labelOrigin: new google.maps.Point(25, 30)
    // }
    const mainIcon: google.maps.Symbol = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 18,
        fillOpacity: 1,
        fillColor: "#04D98B",
        strokeColor: "white",
        strokeWeight: 2,
      };


    const renderer = {
        render: ({ count, position }: Cluster) =>
          new google.maps.Marker({
            icon: mainIcon,
            label: { text: String(count), color: "#ffffff", fontWeight: '500', fontSize: "14px" },
            position,
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          }),
      };

    const cluster = new MarkerClusterer({ map, markers, renderer: renderer });
    return cluster;
}