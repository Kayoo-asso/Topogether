import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { forwardRef, useEffect } from "react";
import { LayerContext, useMap } from "./contexts";
import {
	createBehavior,
	events,
	layerEvents,
	PropsWithChildren,
} from "./core";

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
>;

export const VectorLayer = forwardRef<
	OLVectorLayer<VectorSource>,
	ExternalProps
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
