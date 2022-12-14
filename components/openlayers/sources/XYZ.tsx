import { forwardRef, useEffect } from "react";
import OLXYZ from "ol/source/XYZ";
import { useLayer } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { events, tileSourceEvents } from "../events";

const useBehavior = createLifecycle(OLXYZ, {
	events: events(tileSourceEvents),
	reactive: [
		"attributions",
		"tileLoadFunction",
		"tileUrlFunction",
		"url",
		"urls",
	],
	reset:  [],
});

// Should we restrict TileGrid and Projection to go through dedicated elements?
type Props = InferOptions<typeof useBehavior>;

export const XYZ = forwardRef<OLXYZ, Props>((props, ref) => {
	const xyz = useBehavior(props, ref);
	const layer = useLayer();

	useEffect(() => {
		if (xyz && layer) {
			layer.setSource(xyz);
			return () => layer.setSource(null);
		}
	}, [layer, xyz]);

	useEffect(() => {
		if (xyz && props.tileGrid && props.projection) {
			xyz.setTileGridForProjection(props.projection, props.tileGrid);
		}
	}, [xyz, props.tileGrid, props.projection]);

	return null;
});
