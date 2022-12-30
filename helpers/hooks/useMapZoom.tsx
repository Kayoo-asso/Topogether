import { useMap } from "components/openlayers";
import { View } from "ol";
import { useEffect, useRef, useState } from "react";

const UNDEFINED_ZOOM = -1;

export function useMapZoom(zoomLevels: number | number[]) {
	const thresholds = Array.isArray(zoomLevels) ? zoomLevels : [zoomLevels];
	const map = useMap();
	const [view, setView] = useState<View>(map.getView());
	const [zoom, setZoom] = useState<number>(
		map.getView().getZoom() || UNDEFINED_ZOOM
	);
	const prevZoom = useRef(zoom);

	useEffect(() => {
		const updateView = () => setView(map.getView());
		const updateZoom = () => {
			const zoom = view.getZoom() || UNDEFINED_ZOOM;
			for (let i = 0; i < thresholds.length; ++i) {
				const t = thresholds[i];
				if (
					(prevZoom.current < t && zoom >= t) ||
					(prevZoom.current >= t && zoom < t)
				) {
					setZoom(zoom);
          			break;
				}
			}
      		prevZoom.current = zoom;
		};

		updateZoom();
		map.on("change:view", updateView);
		view.on("change:resolution", updateZoom);

		return () => {
			map.un("change:view", updateView);
			view.un("change:resolution", updateZoom);
		};
	}, [map, view, ...thresholds]);

	return zoom;
}
