import OLModify from "ol/interaction/Modify";
import VectorSource from "ol/source/Vector";
import { forwardRef } from "react";
import { useMap } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { useGetSources } from "../utils";
import { useInteractionLifecycle } from "./useInteractionLifecycle";
import { useCollection } from "../Collection";

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

type P = Omit<InferOptions<typeof useBehavior>, "features" | "source"> &
	(
		| {
				source: string;
				collection?: undefined;
		  }
		| { source?: undefined; collection: string }
	);

// Terrible hack, because Modify is not happy if we do not pass a source or feature collection
// And in our current system, on the first render, `useGetSources` returns `undefined`
const emptySource = new VectorSource();

export const Modify = forwardRef<OLModify, P>(
	({ source, collection, ...props }, ref) => {
		const map = useMap();
		const [s] = useGetSources(map, [source]);
		const features = useCollection(collection);
		if (s && !(s instanceof VectorSource)) {
			throw new Error(
				`The target source of a Draw interaction should be a VectorSource`
			);
		}
		if(features) {
			console.log("Modify got collection:", features)
		}

		const modify = useBehavior(
			{
				...props,
				// Avoid passing `emptySource` when there is a collection
				source: features ? undefined : s || emptySource,
				features,
			},
			ref
		);
		useInteractionLifecycle(modify, map);

		return null;
	}
);
