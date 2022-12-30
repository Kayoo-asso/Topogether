import { useMap } from "components/openlayers";
import { View } from "ol";
import { useEffect, useState } from "react";

export function useMapZoom() {
	const map = useMap();
	const [view, setView] = useState<View>(map.getView());
	const [zoom, setZoom] = useState<number | undefined>(map.getView().getZoom());

	useEffect(() => {
		const updateView = () => setView(map.getView());
		const updateZoom = () => {
			console.log("updateZoom");
			setZoom(view.getZoom());
		};

		map.on("change:view", updateView);
		view.on("change:resolution", updateZoom);

		return () => {
			map.un("change:view", updateView);
			view.un("change:resolution", updateZoom);
		};
	}, [map, view]);

	return zoom || -1;
}
