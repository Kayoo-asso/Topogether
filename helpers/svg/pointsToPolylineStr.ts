import { Position } from "types";

// Example format: "10,20 30,40 10,70 ..."
// The two coordinates of a point are separated by a comma ','
// Two points are separated by a space ' '
export const pointsToPolylineStr = (points: Position[]): string => {
    const pointStrings = points.map(p => p[0] + ',' + p[1]);
    return pointStrings.join(' ');
}