import { UUID } from "types";

export type Image = {
  readonly id: UUID,
  readonly ratio: number
}

export type Breakpoint = "sm" | "md" | "lg" | "xl";