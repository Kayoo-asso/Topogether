import OLMapboxVector from "ol/layer/MapboxVector";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import {
	createLifecycle,
	InferOptions,
} from "../createLifecycle";
import {
	
	events,
	layerEvents,
	tileLayerEvents,
} from "../events";
import { useLayerLifecycle } from "./useLayerLifecycle";

const useLifecycle = createLifecycle(OLMapboxVector, {
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


type Options = InferOptions<typeof useLifecycle>;
type Props = Omit<Options, "map" | "source"> & {
	id?: string;
}

export const MapboxVector = forwardRef<
	OLMapboxVector,
	Props
>(({ id, ...props}, ref) => {
	const layer = useLifecycle(props, ref);
	useLayerLifecycle(id, layer);
	return null;
});