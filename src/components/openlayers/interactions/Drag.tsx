import { forwardRef } from "react";
import { InferOptions, createLifecycle } from "../createLifecycle";
import { DragInteraction } from "../extensions/DragInteraction";
import { useMap } from "../contexts";
import { useInteractionLifecycle } from "./useInteractionLifecycle";
import { useGetSources } from "../utils";
import VectorSource from "ol/source/Vector";

const useBehavior = createLifecycle(
	DragInteraction,
	["drag", "dragend", "dragstart"],
	["cursor", "startCondition"],
	["sources"]
);

export type DragProps = Omit<InferOptions<typeof useBehavior>, "sources"> & {
	sources: string | Array<string>;
};

export const Drag = forwardRef<DragInteraction, DragProps>(
	({ sources: sourceIds, ...props }, ref) => {
		const map = useMap();
		if (!Array.isArray(sourceIds)) {
			sourceIds = [sourceIds];
		}
		const sources = useGetSources(map, sourceIds, true);
		for (let i = 0; i < sources.length; i++) {
			const id = sourceIds[i];
			const source = sources[i];
			if (!(source instanceof VectorSource)) {
				throw new Error(
					`A Drag interaction requires vector sources, but "${id}" is not one.`
				);
			}
		}
		const drag = useBehavior({ ...props, sources: sources as any }, ref);
		useInteractionLifecycle(drag, map);

		return null;
	}
);
