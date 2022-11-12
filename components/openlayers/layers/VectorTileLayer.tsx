import { forwardRef, PropsWithChildren, useEffect } from "react";
import OLVectorTileLayer from "ol/layer/VectorTile";
import { LayerContext, useMap } from "../contexts";
import { createBehavior, events, layerEvents, tileLayerEvents } from "../core";

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

type Props = PropsWithChildren<typeof useBehavior> & {
	id?: string;
};

export const VectorTileLayer = forwardRef<OLVectorTileLayer, Props>(
	({ children, id, ...props }, ref) => {
		const map = useMap();
		const layer = useBehavior(props, ref);

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
		}, [map, layer, id]);

		if (layer) {
			return (
				<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
			);
		} else {
			return null;
		}
	}
);
