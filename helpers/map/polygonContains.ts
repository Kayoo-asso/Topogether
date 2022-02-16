import { GeoCoordinates } from "types";

export function polygonContains(polygon: GeoCoordinates[], point: GeoCoordinates): boolean {
    if (polygon.length < 4) {
        throw new Error("Polygons should contain at least 4 points");
    }
    if (polygon[0].lat !== polygon[polygon.length - 1].lat || polygon[0].lng !== polygon[polygon.length - 1].lng) {
        throw new Error("The first and last points of a polygon should be identical");
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
    
    const targetY = point.lat;
    let intersectCount = 0;
    for (let i = 0; i < polygon.length - 1; ++i) {
        const { lng: x0, lat: y0 } = polygon[i];
        const { lng: x1, lat: y1 } = polygon[i + 1];
        if (y1 === y0) {
            intersectCount += (
                point.lat === y0 &&
                point.lng >= Math.min(x0, x1) &&
                point.lng <= Math.max(x0, x1)
            ) as any;
        }
        else {
            const slope = (x1 - x0) / (y1 - y0);
            const targetX = x0 + slope * (targetY - y0);
            const minX = Math.min(x0, x1, point.lng);
            const maxX = Math.max(x0, x1, point.lng);
            // intersectCount += true <=> intersectCount += 1
            // intersectCount += false <=> intersectCount += 0
            // this avoids an `if` statement
            intersectCount += (
                targetX >= minX &&
                targetX <= maxX
            ) as any;
        }
    }
    return intersectCount % 2 === 1;
}