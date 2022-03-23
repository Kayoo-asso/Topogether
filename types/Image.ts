import { UUID } from "types";

export interface BoulderImage {
  readonly id: UUID,
  readonly path: string
  readonly width: number,
  readonly height: number,
}

