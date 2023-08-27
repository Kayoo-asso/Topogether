import { useMap } from "~/components/openlayers";
import { useEffect, useState } from "react";
import type View from "ol/View";
import { TopoDoc, Rock } from "~/types";
import {
	Extent,
	createEmpty,
	extendCoordinate,
	buffer as addBuffer,
} from "ol/extent";
import { fromLonLat } from "ol/proj";

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

// Used both for fitting the initial extent in MapControl and downloading the tiles in downloadTopo()
export const DEFAULT_EXTENT_BUFFER = 500;

export function getTopoExtent(topo: TopoDoc, buffer?: number): Extent {
	// xmin, ymin, xmax, ymax
	let extent = createEmpty();

	for (const rock of topo.rocks) {
		extendCoordinate(extent, fromLonLat(rock.location));
	}
	for (const parking of topo.parkings) {
		extendCoordinate(extent, fromLonLat(parking.location));
	}
	for (const waypoint of topo.waypoints) {
		extendCoordinate(extent, fromLonLat(waypoint.location));
	}
	if (buffer) {
		extent = addBuffer(extent, buffer);
	}
	return extent;
}

export function getRocksExtent(rocks: Rock[], buffer?: number): Extent {
	let extent = createEmpty();
	for (const rock of rocks) {
		extendCoordinate(extent, fromLonLat(rock.location));
	}
	if (buffer) {
		extent = addBuffer(extent, buffer);
	}
	return extent;
}
