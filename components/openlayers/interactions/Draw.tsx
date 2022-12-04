import OLDraw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { useGetSources } from "../utils";
import { useInteractionLifecycle } from "./useInteractionLifecycle";

const useBehavior = createLifecycle(OLDraw, {
	events: ["change:active", "drawabort", "drawend", "drawstart"],
	reactive: [],
	reset: [
		"clickTolerance",
		"condition",
		"dragVertexDelay",
		"finishCondition",
		"freehand",
		"freehandCondition",
		"geometryFunction",
		"geometryLayout",
		"geometryName",
		"maxPoints",
		"minPoints",
		"snapTolerance",
		"source",
		"stopClick",
		"style",
		"trace",
		"traceSource",
		"type",
		"wrapX",
	],
});

type Props = Omit<
	InferOptions<typeof useBehavior>,
	"source" | "traceSource" | "features"
> & {
	source: string;
	traceSource?: string;
	active?: boolean;
};

export const Draw = forwardRef<OLDraw, Props>(
	({ active, source, traceSource, ...props }, ref) => {
		const map = useMap();
		const [s, ts] = useGetSources(map, [source, traceSource]);
		if (s && !(s instanceof VectorSource)) {
			throw new Error(
				`The target source of a Draw interaction should be a VectorSource`
			);
		}
		if (ts && !(ts instanceof VectorSource)) {
			throw new Error(
				`The trace source of a Draw interaction should be a VectorSource`
			);
		}

		const draw = useBehavior({ ...props, source: s, traceSource: ts}, ref);
		useInteractionLifecycle(draw, active, map);

		return null;
	}
);
