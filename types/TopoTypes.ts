import { AreaType, CoordinatesType, GeoCoordinatesType } from "./GeometricTypes";
import { ImageAfterServerType, ImageBeforeServerType, ImageDimensionType } from "./ImageTypes";

export type TopoType = {
  id: number,
  name: string,
  creatorId: number,
  validatorId: number,
  state: 'DRAFT' | 'TO_VALIDATE' | 'VALIDATED',
  mainImage: ImageAfterServerType,
  mainImageBeforeServer: ImageBeforeServerType,
  description: string,
  rockTypeId: number,
  altitude: number,
  adaptedToChildren: boolean,
  hasDanger: boolean,
  dangerDescription: string,
  securityInstructions: string,
  gearIds: number[],
  cleaningDate: string,
  hasToilets: boolean,
  hasWaterSpot: boolean,
  hasShelter: boolean,
  hasPicnicArea: boolean,
  hasBins: boolean,
  hasOtherGears: boolean,
  otherGears: string,
  otherRemarks: string,
  approachDescription: string,
  approachDifficultyId: number,
  approachTime: number,
  closestCity: string,
  forbiddenReason: string,
  isForbiddenSite: boolean,
  location: GeoCoordinatesType,
  parkings: ParkingType[],
  sectors: SectorType[],
  journeys: JourneyType[],
}

export type ParkingType = {
  id: number,
  location: GeoCoordinatesType,
  description: string,
  image: ImageAfterServerType,
}

export type JourneyType = {
  id: number,
}

export type SectorType = {
  id: number,
  name: string,
  boulders: BoulderType[],
  wayPoints: WaypointType[],
}

export type WaypointType = {
  id: number,
  name: string,
  image: ImageAfterServerType,
  description: string,
  location: GeoCoordinatesType,
}

export type BoulderType = {
  id: number,
  orderIndex: number,
  name: string,
  location: GeoCoordinatesType,
  isHighBall: boolean,
  isMustSee: boolean,
  images: ImageAfterServerType[],
  tracks: TrackType[],
}

export type TrackType = {
  id: number,
  index: number,
    creatorId: number,
    name: string,
    isTraverse: boolean,
    isSittingStart: boolean,
    hasAnchorPoint: boolean,
    hasMantle: boolean,
    difficultyId: number,
    description: string,
    receptionIds: number[],
    techniqueIds: number[],
    height: number,
    orientationIds: number[],
    lines: LineType[],
    note: number,
};

export type LineType = {
  id: number,
  boulderImageId: number,
  boulderImageDimensions: ImageDimensionType,
  linePoints: CoordinatesType[],
  handDeparturePoints: CoordinatesType[],
  feetDeparturePoints: CoordinatesType[],
  forbiddenAreas: AreaType[],
}