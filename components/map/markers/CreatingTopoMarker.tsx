import React, { useCallback } from "react";
import { GeoCoordinates, MarkerEventHandlers, TopoType } from "types";
import { markerSize, toLatLng, useMarker } from "helpers/map";
import { TopoTypeToColor } from "helpers/topo";

interface CreatingTopoMarkerProps {
	location: GeoCoordinates,
	setLocation: (lat: number, lng: number) => void,
	type?: TopoType,
	draggable?: boolean;
}

export const CreatingTopoMarker: React.FC<CreatingTopoMarkerProps> = ({ 
	draggable = false, 
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
		draggable,
		zIndex: 10,
		position: toLatLng(props.location),
	};

	const handlers: MarkerEventHandlers = {
		onDragEnd: useCallback(
			(e: google.maps.MapMouseEvent) => {
				if (e.latLng) {
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
