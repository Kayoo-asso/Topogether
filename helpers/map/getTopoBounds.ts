import { GeoCoordinates, TopoData } from "types";

export type Bounds = [number, number, number, number];

// JavaScript represents small integers with 31 bits
// This is the maximum positive value and the maximum negative value
// that fit in 31 bits (don't forget the sign bit)
const MAX = Math.pow(2, 30) - 1;
const MIN = -MAX;

export function getTopoBounds(topo: TopoData): Bounds {
	// xmin, ymin, xmax, ymax
	const bounds: Bounds = [MAX, MAX, MIN, MIN];

	for (const boulder of topo.boulders) {
		extendBounds(boulder.location, bounds);
	}
	for (const parking of topo.parkings) {
		extendBounds(parking.location, bounds);
	}
	for (const waypoint of topo.waypoints) {
		extendBounds(waypoint.location, bounds);
	}
	return bounds;
}

const extendBounds = (location: GeoCoordinates, bounds: Bounds) => {
	bounds[0] = Math.min(bounds[0], location[0]);
	bounds[1] = Math.min(bounds[1], location[1]);
	bounds[2] = Math.max(bounds[2], location[0]);
	bounds[3] = Math.max(bounds[3], location[1]);
};
