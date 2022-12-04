import type Map from "ol/Map";
import type Layer from "ol/layer/Layer";
import { createContext, useContext, useEffect, useState } from "react";

export const MapContext = createContext<Map | undefined>(undefined);
export const useMap = () => useContext(MapContext);

export const LayerContext = createContext<Layer | undefined>(undefined);
export const useLayer = () => useContext(LayerContext);

export function useSource() {
	const layer = useLayer();
	const [, setSymbol] = useState(Symbol());
	useEffect(() => {
		if (layer) {
			const rerender = () => setSymbol(Symbol());
			layer.on("change:source", rerender);
			return () => layer.un("change:source", rerender);
		}
	}, [layer]);
	return layer?.getSource();
}
