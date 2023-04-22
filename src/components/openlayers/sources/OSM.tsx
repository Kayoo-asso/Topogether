import { forwardRef, useEffect } from "react";
import OLOSM from "ol/source/OSM";
import { useLayer } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { e, tileSourceEvents } from "../events";

// TODO:
// - setUrls
// - setRenderReprojectionEdges
// - setTileGridProjection
// - setTileUrlFunction
const useBehavior = createLifecycle(OLOSM, e(tileSourceEvents), [
	"attributions",
	"tileLoadFunction",
	"url",
]);

export const OSM = forwardRef<OLOSM, InferOptions<typeof useBehavior>>(
	(props, ref) => {
		const source = useBehavior(props, ref);
		const layer = useLayer();

		useEffect(() => {
			if (source && layer) {
				layer.setSource(source);
				return () => layer.setSource(null);
			}
		}, [layer, source]);
		return null;
	}
);
