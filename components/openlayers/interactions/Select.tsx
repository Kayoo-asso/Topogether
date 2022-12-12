import OLSelect from "ol/interaction/Select";
import Layer from "ol/layer/Layer";
import { forwardRef, useContext, useEffect, useMemo } from "react";
import { LayerContext, useLayer, useMap } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { useGetLayers } from "../utils";
import { useInteractionLifecycle } from "./useInteractionLifecycle";

// TODO: add the option to specify a Collection to place the features in

const useBehavior = createLifecycle(OLSelect, {
	events: ["change:active", "select"],
	reactive: ["hitTolerance"],
	reset: [
		"addCondition",
		"condition",
		"filter",
		"multi",
		"layers",
		"removeCondition",
		"toggleCondition",
	],
});

type P = Omit<InferOptions<typeof useBehavior>, "features" | "layers"> & {
	layers: string[];
};

export const Select = forwardRef<OLSelect, P>(
	({ layers, ...props }, ref) => {
		const map = useMap();
		const ls = useGetLayers(map, layers);

		// console.log("Layers: ", ls)
		const filtered: Array<Layer> = useMemo(() => {
			const list =[]
			for (const l of ls) {
				if (l) list.push(l);
			}
			return list;
		}, [ls]);
		const select = useBehavior({ ...props, layers: filtered }, ref);
		if(select && props.style) {
			(select as any).style_=  props.style;
		}
		useInteractionLifecycle(select, map);

		return null;
	}
);
