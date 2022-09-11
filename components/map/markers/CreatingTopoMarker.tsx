import React, { useCallback } from "react";
import { GeoCoordinates, MarkerEventHandlers, TopoTypes } from "types";
import { markerSize, toLatLng, useMarker } from "helpers/map";
import { TopoTypeToColor } from "helpers/topo";

interface CreatingTopoMarkerProps {
	location: GeoCoordinates,
	setLocation: (lat: number, lng: number) => void,
	type?: TopoTypes,
}

export const CreatingTopoMarker: React.FC<CreatingTopoMarkerProps> = ({ 
	...props 
}: CreatingTopoMarkerProps) => {
	const icon: google.maps.Icon = {
		url:
			"/assets/icons/colored/waypoint/_" +
			TopoTypeToColor(props.type) +
			".svg",
		scaledSize: markerSize(30),
	};

	const options: google.maps.MarkerOptions = {
		icon,
		draggable: true,
		zIndex: 10,
		position: toLatLng(props.location),
	};

	const handlers: MarkerEventHandlers = {
		onDragEnd: useCallback(
			(e: google.maps.MapMouseEvent) => {
				if (e.latLng) {
					// console.log("Drag end with latLng", e.latLng.lat(), e.latLng.lng());
					props.setLocation(e.latLng.lat(), e.latLng.lng())
				}
			},
			[props.setLocation]
		),
	};
	useMarker(options, handlers);

	return null;
}

CreatingTopoMarker.displayName = "CreatingTopoMarker";
