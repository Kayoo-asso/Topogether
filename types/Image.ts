import { UUID } from "types";

export type Image = {
  readonly id: UUID,
  readonly ratio: number,
  readonly placeholder?: string,
}