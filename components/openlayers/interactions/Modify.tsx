import OLModify from "ol/interaction/Modify";
import VectorSource from "ol/source/Vector";
import { forwardRef } from "react";
import { useMap } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { useGetSources } from "../utils";
import { useInteractionLifecycle } from "./useInteractionLifecycle";

const useBehavior = createLifecycle(OLModify, {
	events: ["change:active", "modifyend", "modifystart"],
	reactive: [],
	reset: [
		"condition",
		"deleteCondition",
		"hitDetection",
		"insertVertexCondition",
		"pixelTolerance",
		"snapToPointer",
		"style",
		"wrapX",
	],
});

type P = Omit<InferOptions<typeof useBehavior>, "features" | "source"> & {
	active?: boolean;
	source: string;
};

export const Modify = forwardRef<OLModify, P>(
	({ active, source, ...props }, ref) => {
		const map = useMap();
		const [s] = useGetSources(map, [source]);
		if (s && !(s instanceof VectorSource)) {
			throw new Error(
				`The target source of a Draw interaction should be a VectorSource`
			);
		}

		const modify = useBehavior({ ...props, source: s }, ref);
		useInteractionLifecycle(modify, active, map);

		return null;
	}
);
