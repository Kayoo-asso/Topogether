import { Coordinates } from "types";

export const pointsToPolylineStr = (points: Coordinates[]) => {
    if (points) {
        let str = '';
        points.forEach(point => {
            str += `${point.posX},${point.posY} `;
        });
        return str;
    }
    else return undefined;
}