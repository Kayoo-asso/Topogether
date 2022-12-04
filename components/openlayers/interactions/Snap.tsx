import OLSnap from "ol/interaction/Snap";
import VectorSource from "ol/source/Vector";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { useGetSources } from "../utils";
import { useInteractionLifecycle } from "./useInteractionLifecycle";

const useBehavior = createLifecycle(OLSnap, {
	events: ["change:active"],
	reactive: [],
	reset: ["edge", "pixelTolerance", "source", "vertex"]
});

// Add support for a target Collection
type P = Omit<InferOptions<typeof useBehavior>, "features" | "source"> & {
	active?: boolean;
	source: string;
};

export const Modify = forwardRef<OLSnap, P>(
	({ children, active, source, ...props }, ref) => {
		const map = useMap();
		const [s] = useGetSources(map, [source]);
		if (s && !(s instanceof VectorSource)) {
			throw new Error(
				`The target source of a Draw interaction should be a VectorSource`
			);
		}
		const modify = useBehavior({...props, source: s}, ref);

		useInteractionLifecycle(modify, active, map);

		return null;
	}
);
