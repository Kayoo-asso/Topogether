import { forwardRef, useEffect } from "react";
import OLXYZ from "ol/source/XYZ";
import { SourceContext, useLayer } from "./contexts";
import {
	createBehavior,
	events,
	PropsWithChildren,
	tileSourceEvents,
} from "./core";

const useBehavior = createBehavior(OLXYZ, {
	events: events(tileSourceEvents),
	reactive: [
		"attributions",
		"tileLoadFunction",
		"tileUrlFunction",
		"url",
		"urls",
	],
	reset: [],
});

// Should we restrict TileGrid and Projection to go through dedicated elements?
type Props = PropsWithChildren<typeof useBehavior>;

export const XYZ = forwardRef<OLXYZ, Props>(({ children, ...props }, ref) => {
	const xyz = useBehavior(props, ref);
	const layer = useLayer();

	useEffect(() => {
		if (xyz) {
			layer.setSource(xyz);
			return () => layer.setSource(null);
		}
	}, [layer, xyz]);

	useEffect(() => {
		if (xyz && props.tileGrid && props.projection) {
			xyz.setTileGridForProjection(props.projection, props.tileGrid);
		}
	}, [xyz, props.tileGrid, props.projection]);

	return xyz ? (
		<SourceContext.Provider value={xyz}>{children}</SourceContext.Provider>
	) : null;
});
