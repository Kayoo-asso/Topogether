import type View from "ol/View";
import type Map from "ol/Map";
import type Layer from "ol/layer/Layer";
import type Source from "ol/source/Source";
import { createContext, useContext } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export const ViewContext = createContext<View | undefined>(undefined);

export const useView = () => useContext(ViewContext);

export const MapContext = createContext<Map | undefined>(undefined);

export const useMap = () => useContext(MapContext);

export const LayerContext = createContext<Layer | null>(null);

export function useLayer(message?: string): Layer {
	const layer = useContext(LayerContext);
	if (!layer) {
		throw new Error(
			message || "useLayer should only used in children of a <Layer> component"
		);
	}
	return layer;
}
export function useVectorLayer(message?: string): VectorLayer<VectorSource> {
	const layer = useLayer(message);
	if (layer instanceof VectorLayer) {
		return layer;
	}
	throw new Error(
		`useVectorLayer called inside a non-vector layer (type: ${typeof layer})`
	);
}

export const SourceContext = createContext<Source | null>(null);

export function useSource(message?: string): Source {
	const source = useContext(SourceContext);
	if (!source) {
		throw new Error(
			message ||
				"useSource should only used in children of a <Source> component"
		);
	}
	return source;
}

export function useVectorSource(message?: string): VectorSource {
	const source = useSource(message);
	if (source instanceof VectorSource) {
		return source;
	}
	throw new Error(
		`useVectorSource called inside a non-vector source (type: ${typeof source})`
	);
}