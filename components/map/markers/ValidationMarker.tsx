import { useMarker, markerSize } from "helpers/map";
import React from "react";
import { PolygonEventHandlers } from "types";

interface ValidationMarkerProps {
	position: google.maps.LatLng;
	onClick?: () => void;
}

export const ValidationMarker: React.FC<ValidationMarkerProps> = ({
	position,
	onClick,
}: ValidationMarkerProps) => {
	const firstPointOptions: google.maps.MarkerOptions = {
		position,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 14,
			fillColor: "#04D98B",
			fillOpacity: 1,
			strokeWeight: 0,
		},
	};
	const firstPointHandlers: PolygonEventHandlers = {
		onClick,
	};
	useMarker(firstPointOptions, firstPointHandlers);

	const checkIcon: google.maps.Icon = {
		url: "/assets/icons/colored/_checked.svg",
		scaledSize: markerSize(16),
		anchor: new google.maps.Point(8, 8),
	};
	const checkOptions: google.maps.MarkerOptions = {
		icon: checkIcon,
		position: position,
	};
	const checkHandlers: PolygonEventHandlers = {
		onClick,
	};
	useMarker(checkOptions, checkHandlers);

	return null;
};

ValidationMarker.displayName = "BoulderMarker";
