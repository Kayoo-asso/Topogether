import type View from "ol/View";
import type Map from "ol/Map";
import type Layer from "ol/layer/Layer";
import type Source from "ol/source/Source";
import { createContext, useContext } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Interaction from "ol/interaction/Interaction";
import Select from "ol/interaction/Select";
import Draw from "ol/interaction/Draw";
import DragBox from "ol/interaction/DragBox";
import Modify from "ol/interaction/Modify";
import Snap from "ol/interaction/Snap";

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