import { UUID } from "types";

export interface BoulderImage {
  readonly id: UUID,
  readonly url: string
  readonly width: number,
  readonly height: number,
}

// TODO: see if we also need a boulderId
export interface DBBoulderImage {
  id: UUID,
  url: string
  width: number,
  height: number,
  topoId: UUID, 
}

export type ImageType = "jpg" | "png";
