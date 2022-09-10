import { useMarker, markerSize } from "helpers/map";
import React from "react";
import { PolygonEventHandlers } from "types";

interface ValidationMarkerProps {
	path: google.maps.LatLng[];
	onClick?: () => void;
}

export const ValidationMarker: React.FC<ValidationMarkerProps> = (props: ValidationMarkerProps) => {

	const closable = props.path.length > 3;
	const firstPointOptions: google.maps.MarkerOptions = {
		position: props.path[0],
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			scale: closable ? 14 : 6,
			fillColor: "#04D98B",
			fillOpacity: 1,
			strokeWeight: 0,
		},
	};
	const firstPointHandlers: PolygonEventHandlers = {
		onClick: closable ? props.onClick : undefined,
	};
	useMarker(firstPointOptions, firstPointHandlers);

	const checkIcon: google.maps.Icon = {
		url: "/assets/icons/colored/_checked.svg",
		scaledSize: closable ? markerSize(16) : markerSize(0),
		anchor: new google.maps.Point(8, 8),
	};
	const checkOptions: google.maps.MarkerOptions = {
		icon: checkIcon,
		position: props.path[0],
	};
	const checkHandlers: PolygonEventHandlers = {
		onClick: props.onClick,
	};
	useMarker(checkOptions, checkHandlers);

	return null;
};

ValidationMarker.displayName = "BoulderMarker";
