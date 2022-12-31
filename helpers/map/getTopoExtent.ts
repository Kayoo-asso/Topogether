import { Extent, createEmpty, extendCoordinate, isEmpty } from "ol/extent";
import { fromLonLat } from "ol/proj";
import { Topo, TopoData } from "types";
import { buffer as addBuffer } from "ol/extent";

// Used both for fitting the initial extent in MapControl and downloading the tiles in downloadTopo()
export const DEFAULT_EXTENT_BUFFER = 500;

export function getTopoExtent(topo: TopoData | Topo, buffer?: number): Extent {
	// xmin, ymin, xmax, ymax
	let extent = createEmpty()

	for (const boulder of topo.boulders) {
		extendCoordinate(extent, fromLonLat(boulder.location));
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
