import { AreaType, CoordinatesType, GeoCoordinatesType } from "./GeometricTypes";
import { ImageAfterServer, ImageBeforeServer, ImageDimension } from "./ImageTypes";

export type TopoType = {
  id: number,
  name: string,
  creatorId: number,
  validatorId?: number,
  state: 'DRAFT' | 'TO_VALIDATE' | 'VALIDATED',
  location: GeoCoordinatesType,
  mainImage?: ImageAfterServer,
  mainImageBeforeServer?: ImageBeforeServer,
  description?: string,
  rockTypeId?: number,
  altitude?: number,
  adaptedToChildren?: boolean,
  hasDanger?: boolean,
  dangerDescription?: string,
  securityInstructions?: string,
  gearIds?: number[],
  cleaningDate?: string,
  hasToilets?: boolean,
  hasWaterSpot?: boolean,
  hasShelter?: boolean,
  hasPicnicArea?: boolean,
  hasBins?: boolean,
  hasOtherGears?: boolean,
  otherGears?: string,
  otherRemarks?: string,
  approachDescription?: string,
  approachDifficultyId?: number,
  approachTime?: number,
  closestCity?: string,
  forbiddenReason?: string,
  isForbiddenSite?: boolean,
  parkings?: ParkingType[],
  sectors: SectorType[],
  journeys?: JourneyType[],
}

export type ParkingType = {
  id: number,
  location: GeoCoordinatesType,
  placeNumber?: number,
  description?: string,
  image?: ImageAfterServer,
}

export type JourneyType = {
  id: number,
}

export type SectorType = {
  id: number,
  name: string,
  boulders: BoulderType[],
  wayPoints?: WaypointType[],
}

export type WaypointType = {
  id: number,
  name: string,
  location: GeoCoordinatesType,
  image?: ImageAfterServer,
  description?: string,
}

export type BoulderType = {
  id: number,
  orderIndex: number,
  name: string,
  location: GeoCoordinatesType,
  isHighBall?: boolean,
  isMustSee?: boolean,
  hasDangerousDescent?: boolean,
  images?: ImageAfterServer[],
  tracks?: TrackType[],
}

export type TrackType = {
  id: number,
  orderIndex: number,
  creatorId: number,
  name: string,
  isTraverse?: boolean,
  isSittingStart?: boolean,
  anchorNumber?: number,
  difficultyId?: number,
  description?: string,
  receptionId?: number,
  techniqueIds?: number[],
  height?: number,
  orientationId?: number,
  lines?: LineType[],
  note?: number,
};

export type LineType = {
  id: number,
  boulderImageId: number,
  boulderImageDimensions: ImageDimension,
  linePoints?: CoordinatesType[],
  handDeparturePoints?: CoordinatesType[],
  feetDeparturePoints?: CoordinatesType[],
  anchorPoints?: CoordinatesType[],
  forbiddenAreas?: AreaType[],
}