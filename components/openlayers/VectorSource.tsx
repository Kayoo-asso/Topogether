import OLVectorSource from "ol/source/Vector";
import { forwardRef, PropsWithChildren, useEffect } from "react";
import { SourceContext, useVectorLayer } from "./contexts";
import {
	createBehavior,
	events,
	vectorSourceEvents,
} from "./core";

const useBehavior = createBehavior(OLVectorSource, {
	events: events(vectorSourceEvents),
	reactive: ["attributions", "loader", "url"],
});

export const VectorSource = forwardRef<
	OLVectorSource,
	PropsWithChildren<typeof useBehavior>
>(({ children, ...props }, ref) => {
	const layer = useVectorLayer();
	const source = useBehavior(props, ref);

	useEffect(() => {
		if (source) {
			layer.setSource(source);
			return () => layer.setSource(null);
		}
	}, [layer, source]);

	return source ? (
		<SourceContext.Provider value={source}>{children}</SourceContext.Provider>
	) : null;
});
