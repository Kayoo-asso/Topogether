import { useMap } from "~/components/openlayers";
import { useEffect, useRef, useState } from "react";
import type View from "ol/View";

export function useView() {
	const map = useMap();
	const [view, setView] = useState<View>(map.getView());
	// Synchronize the view, in case it changes
	useEffect(() => {
		const updateView = () => setView(map.getView());
		map.on("change:view", updateView);
		return () => map.un("change:view", updateView);
	}, [map]);
	return view;
}

export function useZoomThreshold(threshold: number) {
	const view = useView();
	// Only use the initial value
	const [state, setState] = useState(checkThreshold(view, threshold));

	useEffect(() => {
		const update = () => {
			setState(checkThreshold(view, threshold));
		};

		update();
		view.on("change:resolution", update);

		return () => view.un("change:resolution", update);
	}, [view, threshold]);

	return state;
}
function checkThreshold(view: View, threshold: number) {
	const zoom = view.getZoom();
	if (!zoom) {
		return undefined;
	} else if (zoom >= threshold) {
		return "above";
	} else {
		return "below";
	}
}
