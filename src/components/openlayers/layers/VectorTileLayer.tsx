import { forwardRef, PropsWithChildren } from "react";
import OLVectorTileLayer from "ol/layer/VectorTile";
import { LayerContext } from "../contexts";
import { createLifecycle } from "../createLifecycle";
import { useLayerLifecycle } from "./useLayerLifecycle";
import { e, layerEvents, tileLayerEvents } from "../events";

const useBehavior = createLifecycle(
	OLVectorTileLayer,
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
		// Or should it be controlled through components?
		"style",
	]
);

type Props = PropsWithChildren<typeof useBehavior> &
	React.PropsWithChildren<{
		id?: string;
	}>;

export const VectorTileLayer = forwardRef<OLVectorTileLayer, Props>(
	({ children, id, ...props }, ref) => {
		const layer = useBehavior(props, ref);

		useLayerLifecycle(id, layer);

		return (
			<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
		);
	}
);
