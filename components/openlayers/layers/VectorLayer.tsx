import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { forwardRef, useEffect } from "react";
import { LayerContext, useMap } from "../contexts";
import {
	createBehavior,
	events,
	layerEvents,
	PropsWithChildren,
} from "../core";

const useBehavior = createBehavior(OLVectorLayer, {
	events: events(layerEvents),
	reactive: [
		"extent",
		"maxResolution",
		"maxZoom",
		"minResolution",
		"minZoom",
		"opacity",
		"style",
		"visible",
		"zIndex",
	],
});

type ExternalProps = Omit<
	PropsWithChildren<typeof useBehavior>,
	"source" | "map"
> & {
	id?: string;
};

export const VectorLayer = forwardRef<
	OLVectorLayer<VectorSource>,
	ExternalProps
>(({ children, id, ...props }, ref) => {
	const layer = useBehavior(props, ref);
	const map = useMap();

	useEffect(() => {
		if (layer) {
			// This is Map.addLayer() does
			const layers = map.getLayerGroup().getLayers()
			layers.push(layer)
			// We also add the ability to store them by ID
			if(id) {
				layers.set(id, layer)
			}
			return () => {
				map.removeLayer(layer);
				if(id) {
					layers.set(id, undefined)
				}
			};
		}
	}, [layer, map, id]);

	return layer ? (
		<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
	) : null;
});
