import { forwardRef, useEffect } from "react";
import OLOSM from "ol/source/OSM";
import { SourceContext, useLayer } from "./contexts";
import { createBehavior, Props } from "./core";

// TODO:
// - setUrls
// - setRenderReprojectionEdges
// - setTileGridProjection
// - setTileUrlFunction
const useBehavior = createBehavior(OLOSM, {
	events: [
		"change",
		"error",
		"propertychange",
		"tileloadend",
		"tileloaderror",
		"tileloadstart",
	],
	reactive: ["attributions", "tileLoadFunction", "url"],
	reset: [],
});

export const OSM = forwardRef<OLOSM, Props<typeof useBehavior>>(
	({ children, ...props }, ref) => {
		const source = useBehavior(props, ref);
		const layer = useLayer();

		useEffect(() => {
			if (source) {
				layer.setSource(source);
				return () => layer.setSource(null);
			}
		});

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
