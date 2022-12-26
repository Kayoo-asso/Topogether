import { Extent, createEmpty, extendCoordinate } from "ol/extent";
import { fromLonLat } from "ol/proj";
import { Topo, TopoData } from "types";
import { buffer as addBuffer } from "ol/extent";

// TODO: merge those two
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
	if(buffer) {
		extent = addBuffer(extent, buffer);
	}
	return extent;
}

// const extendBounds = (location: GeoCoordinates, bounds: Bounds) => {
//   location = fromLonLat(location) as GeoCoordinates;
// 	bounds[0] = Math.min(bounds[0], location[0]);
// 	bounds[1] = Math.min(bounds[1], location[1]);
// 	bounds[2] = Math.max(bounds[2], location[0]);
// 	bounds[3] = Math.max(bounds[3], location[1]);
// };
