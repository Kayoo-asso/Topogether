import { GeoCoordinates } from "types";

export function polygonContains(polygon: GeoCoordinates[], point: GeoCoordinates): boolean {
    if (polygon.length < 3) {
        throw new Error("Polygons should contain at least 3 points");
    }

    // We are using the raycasting algorithm:
    // https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm
    // We cast a horizontal ray to the right of the point, which keeps the same y coordinate
    // Then, for each edge of the polygon, we determine the x coordinate of the intersection
    // between the corresponding infinite line and our horizontal ray
    // If that x coordinate is to the right of our point AND is contained in the edge, we have
    // an intersection.
    // If the ray intersects the polygon an odd number of times, the point is within the polygon
    // If it intersects it an even number of times, the point is outside.

    let intersectCount = 0;
    for (let i = 0; i < polygon.length - 1; ++i) {
        // intersectCount += true <=> intersectCount += 1
        // intersectCount += false <=> intersectCount += 0
        // this avoids an `if` statement
        intersectCount += rayIntersects(point.lng, point.lat, polygon[i], polygon[i+1]) as any;
    }
    // check the last edge
    intersectCount += rayIntersects(point.lng, point.lat, polygon[polygon.length - 1], polygon[0]) as any;

    return intersectCount % 2 === 1;
}

function rayIntersects(lng: number, lat: number, p0: GeoCoordinates, p1: GeoCoordinates): boolean {
    const { lng: x0, lat: y0 } = p0;
    const { lng: x1, lat: y1 } = p1;
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    if (y1 === y0) {
        return (
            lat === y0 &&
            lng >= minX &&
            lng <= maxX
        );
    }
    else {
        const slope = (x1 - x0) / (y1 - y0);
        // the latitude of the point is the Y-coordinate of the ray
        const targetX = x0 + slope * (lat - y0);
        return (
            targetX >= lng &&
            targetX >= minX &&
            targetX <= maxX
        );
    }
}