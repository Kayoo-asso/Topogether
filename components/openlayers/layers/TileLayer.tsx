import OLTileLayer from "ol/layer/Tile";
import type TileSource from "ol/source/Tile";
import { forwardRef, useEffect } from "react";
import { LayerContext, useMap } from "../contexts";
import {
	createBehavior,
	events,
	layerEvents,
	PropsWithChildren,
	tileLayerEvents,
} from "../core";

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

type Props = Omit<PropsWithChildren<typeof useBehavior>, "source"> & {
	id?: string;
};

export const TileLayer = forwardRef<OLTileLayer<TileSource>, Props>(
	({ children, id, ...props }, ref) => {
		const layer = useBehavior(props, ref);
		const map = useMap();
		useEffect(() => {
			if (layer) {
				// This is Map.addLayer() does
				const layers = map.getLayerGroup().getLayers();
				layers.push(layer);
				// We also add the ability to store them by ID
				if (id) {
					layers.set(id, layer);
				}
				return () => {
					map.removeLayer(layer);
					if (id) {
						layers.set(id, undefined);
					}
				};
			}
		}, [layer, map, id]);
		return layer ? (
			<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
		) : null;
	}
);
