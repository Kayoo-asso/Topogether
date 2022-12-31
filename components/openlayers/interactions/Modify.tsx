import OLModify from "ol/interaction/Modify";
import VectorSource from "ol/source/Vector";
import { forwardRef } from "react";
import { useMap } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { useGetSources } from "../utils";
import { useInteractionLifecycle } from "./useInteractionLifecycle";

const useBehavior = createLifecycle(
	OLModify,
	["change:active", "modifyend", "modifystart"],
	[],
	[
		"condition",
		"deleteCondition",
		"hitDetection",
		"insertVertexCondition",
		"pixelTolerance",
		"snapToPointer",
		"style",
		"wrapX",
		"source",
	]
);

type P = Omit<InferOptions<typeof useBehavior>, "features" | "source"> & {
	source: string;
};

// Terrible hack, because Modify is not happy if we do not pass a source, layer or feature collection
const emptySource = new VectorSource();

export const Modify = forwardRef<OLModify, P>(({ source, ...props }, ref) => {
	const map = useMap();
	const [s] = useGetSources(map, [source]);
	if (s && !(s instanceof VectorSource)) {
		throw new Error(
			`The target source of a Draw interaction should be a VectorSource`
		);
	}

	const modify = useBehavior({ ...props, source: s || emptySource }, ref);
	useInteractionLifecycle(modify, map);

	return null;
});
