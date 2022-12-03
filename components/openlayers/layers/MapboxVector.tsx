import OLMapboxVector from "ol/layer/MapboxVector";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
	createBehavior,
	events,
	layerEvents,
	tileLayerEvents,
	InferProps,
} from "../core";
import { useId, useMainContext } from "../init";

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

type Props = InferProps<typeof useBehavior> & {
	id?: string;
};

export const MapboxVector = forwardRef<OLMapboxVector, Props>(
	({ id, ...props }, ref) => {
		const layer = useBehavior(props, ref);
		const internalId = useId(id);
		const ctx = useMainContext();

		useEffect(() => {
			if (layer) {
				ctx.registerLayer(layer, internalId);

				return () => ctx.disposeLayer(layer, internalId);
			}
		}, [layer]);

		return null;
	}
);
