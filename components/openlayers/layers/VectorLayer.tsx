import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { forwardRef, useEffect, useMemo } from "react";
import {
	createBehavior,
	events,
	layerEvents,
	InferPropsWithChildren,
} from "../core";
import { useId, useMainContext } from "../init";

const useBehavior = createBehavior(OLVectorLayer, {
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

type ExternalProps = Omit<
	InferPropsWithChildren<typeof useBehavior>,
	"source" | "map"
> & {
	id?: string;
};

export const VectorLayer = forwardRef<
	OLVectorLayer<VectorSource>,
	ExternalProps
>(({ children, id, ...props }, ref) => {
	const layer = useBehavior(props, ref);
	const internalId = useId(id);
	const ctx = useMainContext();

	useEffect(() => {
		if (layer) {
			ctx.registerLayer(layer, internalId);

			return () => ctx.disposeLayer(layer, internalId);
		}
	}, [layer]);

	return <>{children}</>;
});
