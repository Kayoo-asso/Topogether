import { Position } from "types";

export const getCoordsInViewbox = (
    vb: SVGRectElement,
    cWidth: number,
    cHeight: number,

): Position | undefined => {
    // viewBox coordinates
    const box = vb.getBoundingClientRect();
    const vbWidth = vb.width.baseVal.value;
    const vbHeight = vb.height.baseVal.value;

    // click position in viewBox
    const cx = cWidth - box.x;
    const cy = cHeight - box.y;

    // check that the click is in the viewBox
    if (cx < 0 || cy < 0 || cx > box.width || cy > box.height) return;

    const x = vbWidth * cx / box.width;
    const y = vbHeight * cy / box.height;
    // console.log("final coordinates :"+x+', '+y)

    const end = Date.now();
    return [x, y];
}