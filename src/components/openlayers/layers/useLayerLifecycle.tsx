import BaseLayer from "ol/layer/Base";
import { useEffect } from "react";
import { useMap } from "../contexts";

export function useLayerLifecycle(id: string | undefined, layer: BaseLayer | undefined) {
		const map = useMap();

		useEffect(() => {
			if (layer && map) {
				// This is Map.addLayer() does
				const layers = map.getLayerGroup().getLayers();
				layers.push(layer);
				// We also add the ability to store them by ID
				if (id) {
					layers.set(id, layer);
				}
				return () => {
					map.removeLayer(layer);
					if (id) {
						layers.unset(id);
					}
				};
			}
		}, [layer, map, id]);
}