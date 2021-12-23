import { Position } from "types";

export const getMousePosInside = (e: React.MouseEvent): Position => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
}