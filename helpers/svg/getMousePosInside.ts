import { Position } from "types";

export const getMousePosInside = (e: React.MouseEvent): Position => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.right - rect.left;
    const height = rect.top - rect.bottom;
    const x = (e.clientX - rect.left) * 100 / width;
    const y = (rect.top - e.clientY) * 100 / height;
    return [x, y];
}