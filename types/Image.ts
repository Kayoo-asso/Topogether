import { UUID } from "types";

// export interface BoulderImage {
//   readonly id: UUID,
//   readonly width: number,
//   readonly height: number,
// }

export type Image = {
  readonly id: UUID,
  readonly ratio: Ratio
}

export type Ratio = "16:9" | "9:16" | "3:4" | "4:3" | "1:1";
export type Breakpoint = "sm" | "md" | "lg" | "xl";