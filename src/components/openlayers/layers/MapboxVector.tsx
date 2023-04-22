import OLMapboxVector from "ol/layer/MapboxVector";
import { forwardRef } from "react";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { e, layerEvents, tileLayerEvents } from "../events";
import { useLayerLifecycle } from "./useLayerLifecycle";

const useLifecycle = createLifecycle(
	OLMapboxVector,
	[...e(layerEvents), ...e(tileLayerEvents)],
	[
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
	]
);

type Options = InferOptions<typeof useLifecycle>;
type Props = Omit<Options, "map" | "source"> & {
	id?: string;
};

export const MapboxVector = forwardRef<OLMapboxVector, Props>(
	({ id, ...props }, ref) => {
		const layer = useLifecycle(props, ref);
		useLayerLifecycle(id, layer);
		return null;
	}
);
