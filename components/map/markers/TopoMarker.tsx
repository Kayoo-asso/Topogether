import React, { useCallback } from "react";
import { markerSize, toLatLng, useMarker } from "helpers/map";
import { MarkerEventHandlers, LightTopo, TopoTypes } from "types";
import { TopoTypeToColor } from "helpers/topo";

interface TopoMarkerProps {
	topo: LightTopo;
	type?: TopoTypes;
	onClick?: (topo: LightTopo) => void;
}

export const TopoMarker: React.FC<TopoMarkerProps> = (
	props: TopoMarkerProps
) => {
	const icon: google.maps.Icon = {
		url:
			"/assets/icons/colored/waypoint/_" +
			TopoTypeToColor(props.topo.type) +
			".svg",
		scaledSize: markerSize(30),
	};

	const options: google.maps.MarkerOptions = {
		icon,
		draggable: false,
		position: toLatLng(props.topo.location),
	};

	const handlers: MarkerEventHandlers = {
		onClick: useCallback(
			() => props.onClick && props.onClick(props.topo),
			[props.topo, props.onClick]
		),
	};
	useMarker(options, handlers);

	return null;
};

TopoMarker.displayName = "TopoMarker";
