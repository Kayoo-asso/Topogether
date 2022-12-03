import { forwardRef, useEffect } from "react";
import OLOSM from "ol/source/OSM";
import { SourceContext, useLayer } from "../contexts";
import { createBehavior, events, InferProps, tileSourceEvents } from "../core";

// TODO:
// - setUrls
// - setRenderReprojectionEdges
// - setTileGridProjection
// - setTileUrlFunction
const useBehavior = createBehavior(OLOSM, {
	events: events(tileSourceEvents),
	reactive: ["attributions", "tileLoadFunction", "url"],
	reset: [],
});

export const OSM = forwardRef<OLOSM, InferProps<typeof useBehavior>>(
	({ children, ...props }, ref) => {
		const source = useBehavior(props, ref);
		const layer = useLayer();

		useEffect(() => {
			if (source) {
				layer.setSource(source);
				return () => layer.setSource(null);
			}
		}, [layer, source]);

		if (source) {
			return (
				<SourceContext.Provider value={source}>
					{children}
				</SourceContext.Provider>
			);
		} else {
			return null;
		}
	}
);
