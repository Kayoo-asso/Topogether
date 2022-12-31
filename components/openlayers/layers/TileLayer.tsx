import OLTileLayer from "ol/layer/Tile";
import type TileSource from "ol/source/Tile";
import { forwardRef, useEffect } from "react";
import { LayerContext, useMap } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { e, layerEvents, tileLayerEvents } from "../events";
import { useLayerLifecycle } from "./useLayerLifecycle";

const useBehavior = createLifecycle(
	OLTileLayer,
	[...e(layerEvents), ...e(tileLayerEvents)],
	[
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

type Props = Omit<InferOptions<typeof useBehavior>, "source"> &
	React.PropsWithChildren<{
		id?: string;
	}>;

export const TileLayer = forwardRef<OLTileLayer<TileSource>, Props>(
	({ children, id, ...props }, ref) => {
		const layer = useBehavior(props, ref);

		useLayerLifecycle(id, layer);
		return (
			<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
		);
	}
);
