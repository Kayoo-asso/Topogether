import { Point } from "types";

export const pointsToPolylineStr = (points: Point[]) => {
    if (points) {
        let str = '';
        points.forEach(point => {
            str += `${point.x},${point.y} `;
        });
        return str;
    }
    else return undefined;
}