import type Map from "ol/Map";
import type Layer from "ol/layer/Layer";
import { createContext, useContext, useEffect, useState } from "react";

export const MapContext = createContext<Map>(undefined!);
export const useMap = (): Map => {
  const map = useContext(MapContext)
  if(!map) {
    throw new Error("useMap should only be used in children of a <Map> component");
  }
  return map;
}

export const LayerContext = createContext<Layer | undefined>(undefined);
export const useLayer = () => useContext(LayerContext);

export function useSource() {
	const layer = useLayer();
  const [source, setSource] = useState(layer?.getSource());
	useEffect(() => {
		if (layer) {
      const updateSource = () => setSource(layer.getSource());
			layer.on("change:source", updateSource);
      updateSource();
			return () => layer.un("change:source", updateSource);
		}
	}, [layer]);
	return source;
}
