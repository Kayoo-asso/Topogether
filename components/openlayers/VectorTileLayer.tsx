import {
	forwardRef,
	PropsWithChildren,
	useEffect,
} from "react";
import OLVectorTileLayer from "ol/layer/VectorTile";
import { LayerContext, useMap } from "./contexts";
import { createBehavior, events, layerEvents, tileLayerEvents } from "./core";

const useBehavior = createBehavior(OLVectorTileLayer, {
	events: events(layerEvents, tileLayerEvents),
	reactive: [
		"background",
		"extent",
		"maxResolution",
		"maxZoom",
		"minResolution",
		"minZoom",
		"opacity",
		"preload",
		// Or should it be controlled through components?
		"style",
	],
	reset: [],
});

export const VectorTileLayer = forwardRef<
	OLVectorTileLayer,
	PropsWithChildren<typeof useBehavior>
>(({ children, ...props }, ref) => {
	const map = useMap();
	const layer = useBehavior(props, ref);

	useEffect(() => {
		if (layer) {
			map.addLayer(layer);
			return () => {
				map.removeLayer(layer);
			};
		}
	}, [map, layer]);

	if (layer) {
		return (
			<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
		);
	} else {
		return null;
	}
});
