import BaseLayer from "ol/layer/Base";
import { createContext, useContext } from "react";

export const LayerContext = createContext<BaseLayer | null>(null);

export function useLayer() {
	const layer = useContext(LayerContext);
	if (!layer) {
		throw new Error(
			"useLayer should only be used inside some kind of <Layer> component"
		);
	}
	return layer;
}
