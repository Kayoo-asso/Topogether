import { UUID } from "./UUID";


export interface Image {
  id: UUID,
  url: string
  // TODO: width and height?
}

export interface ImageDimensions {
    width: number,
    height: number
}