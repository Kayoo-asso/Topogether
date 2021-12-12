import { CoordinatesType } from "types";

export const pointsToPolylineStr = (points: CoordinatesType[]) => {
    if (points) {
        let str = '';
        points.forEach(point => {
            str += `${point.posX},${point.posY} `;
        });
        return str;
    }
    else return undefined;
}