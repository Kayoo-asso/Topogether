import { UUID } from "types";

export interface BoulderImage {
  readonly id: UUID,
  readonly imagePath: string
  readonly width: number,
  readonly height: number,
}

// TODO: see if we also need a boulderId
export interface DBBoulderImage {
  id: UUID,
  index: number,
  width: number,
  height: number,
  boulderId: UUID,
  topoId: UUID, 
  imagePath: string,
}

export type ImageType = "jpg" | "png";
