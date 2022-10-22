import { useView, MapContext } from "./contexts";
import OLMap from "ol/Map";
import { createBehavior, PropsWithChildren } from "./core";
import { forwardRef, useEffect } from "react";

// TODO: way to omit some Props
// TODO: additional reactive properties that are not in the Options
const useBehavior = createBehavior(OLMap, {
	events: [
		"change",
		"change:layerGroup",
		"change:size",
		"change:target",
		"change:view",
		"click",
		"dblclick",
		"error",
		"loadend",
		"loadstart",
		"moveend",
		"movestart",
		"pointerdrag",
		"pointermove",
		"postcompose",
		"postrender",
		"precompose",
		"propertychange",
		"rendercomplete",
		"singleclick",
	],
	reactive: [
		// "size",
	],
	reset: [],
});

export const Map = forwardRef<OLMap, PropsWithChildren<typeof useBehavior>>(
	({ children, ...props }, ref) => {
		const map = useBehavior(props, ref);
		const view = useView();

		useEffect(() => {
			if (map) {
				map.setView(view);
			}
		}, [map, view]);

		return (
			<div id="map">
				{map ? (
					<MapContext.Provider value={map}>{children}</MapContext.Provider>
				) : null}
			</div>
		);
	}
);
