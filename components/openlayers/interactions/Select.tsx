import OLSelect, { SelectEvent } from "ol/interaction/Select";
import Layer from "ol/layer/Layer";
import { forwardRef, useContext, useEffect, useMemo } from "react";
import { LayerContext, useLayer, useMap } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { useGetLayers } from "../utils";
import { useInteractionLifecycle } from "./useInteractionLifecycle";

// TODO: add the option to specify a Collection to place the features in

const useBehavior = createLifecycle(OLSelect, 
	["change:active", "select"],
	["hitTolerance"],
	[
		"addCondition",
		"condition",
		"filter",
		"multi",
		"layers",
		"removeCondition",
		"toggleCondition",
	],
);

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
			// TODO: not sure this is always correct
			for(const feature of select.getFeatures().getArray()) {
				feature.setStyle(props.style)
			}
		}
		useInteractionLifecycle(select, map);

		return null;
	}
);

export function removePreviouslySelected(event: SelectEvent) {
	if(event.selected.length > 0) {
		const selected = new Set(event.selected);
		const interaction = event.target as OLSelect;
		const collection = interaction.getFeatures();
		const array = collection.getArray();
		for(let i =0; i< array.length; i++) {
			if(!selected.has(array[i])) {
				collection.removeAt(i);
			}
		}
	}
}
