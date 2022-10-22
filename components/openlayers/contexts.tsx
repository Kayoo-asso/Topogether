import View from "ol/View";
import Map from "ol/Map";
import Layer from "ol/layer/Layer";
import Source from "ol/source/Source";
import { createContext, useContext } from "react";

export const ViewContext = createContext<View | null>(null);

export function useView(message?: string): View {
	const view = useContext(ViewContext);
	if (!view) {
		throw new Error(
			message || "useView should only used in children of a <View> component"
		);
	}
	return view;
}

export const MapContext = createContext<Map | null>(null);

export function useMap(message?: string): Map {
	const map = useContext(MapContext);
	if (!map) {
		throw new Error(
			message || "useMap should only used in children of a <Map> component"
		);
	}
	return map;
}

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

export const SourceContext = createContext<Source | null>(null);

export function useSource(message?: string): Source {
	const source = useContext(SourceContext);
	if (!source) {
		throw new Error(
			message || "useSource should only used in children of a <Source> component"
		);
	}
	return source;
}