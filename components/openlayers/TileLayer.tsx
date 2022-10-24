import OLTileLayer from "ol/layer/Tile";
import type TileSource from "ol/source/Tile";
import { forwardRef, useEffect } from "react";
import { LayerContext, useMap } from "./contexts";
import { createBehavior, events, layerEvents, PropsWithChildren, tileLayerEvents } from "./core";

const useBehavior = createBehavior(OLTileLayer, {
	events: events(layerEvents, tileLayerEvents),
	reactive: [
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
	reset: [],
});

export const TileLayer = forwardRef<
	OLTileLayer<TileSource>,
	PropsWithChildren<typeof useBehavior>
>(({ children, ...props }, ref) => {
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
	return layer ? (
		<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
	) : null;
});
