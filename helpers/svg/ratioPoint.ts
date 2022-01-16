import { Position } from "types"

export const ratioPoint = (p: Position, r: number): Position => { return [p[0]*r, p[1]*r] }