import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { forwardRef, useEffect } from "react";
import { LayerContext } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";

import { events, layerEvents } from "../events";
import { useLayerLifecycle } from "./useLayerLifecycle";

const useBehavior = createLifecycle(OLVectorLayer, {
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

type Props = Omit<InferOptions<typeof useBehavior>, "source" | "map"> & React.PropsWithChildren<{
	id?: string;
}>;

export const VectorLayer = forwardRef<OLVectorLayer<VectorSource>, Props>(
	({ children, id, ...props }, ref) => {
		const layer = useBehavior(props, ref);
		useLayerLifecycle(id, layer);

		return (
			<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
		);
	}
);
