import OLMapboxVector from "ol/layer/MapboxVector";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import {
	createBehavior,
	events,
	layerEvents,
	tileLayerEvents,
	Props,
} from "../core";

const useBehavior = createBehavior(OLMapboxVector, {
	reactive: [
		"background",
		"extent",
		"maxResolution",
		"maxZoom",
		"minResolution",
		"minZoom",
		"opacity",
		"preload",
		"useInterimTilesOnError",
		"visible",
		"zIndex",
	],
	events: events(layerEvents, tileLayerEvents),
});

export const MapboxVector = forwardRef<
	OLMapboxVector,
	Props<typeof useBehavior>
>((props, ref) => {
	const layer = useBehavior(props, ref);
	const map = useMap();

	useEffect(() => {
		if (layer) {
			map.addLayer(layer);
			return () => {
				map.removeLayer(layer);
			};
		}
	}, [layer, map]);
	return null;
});
