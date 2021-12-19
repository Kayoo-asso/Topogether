import { GradeEnum } from './enums';
import { Area, Coordinates, GeoCoordinates } from './GeometricTypes';
import { ImageAfterServer, ImageBeforeServer, ImageDimension } from './ImageTypes';

export type Topo = {
  id: number,
  name: string,
  creatorId: number,
  validatorId?: number,
  topoType: 'Boulder' | 'Cliff' | 'Deep water' | 'Multi-pitch' | 'Artificial',
  status: 'Draft' | 'Submitted' | 'Validated',
  location: GeoCoordinates,
  mainImage?: ImageAfterServer,
  mainImageBeforeServer?: ImageBeforeServer,
  description?: string,
  rockType?: string,
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
  parkings?: Parking[],
  sectors: Sector[],
  journeys?: Journey[],
};

export type LightTopo = Omit<Topo, 'sectors' | 'journeys'> & {
  numberOfSectors: number,
  numberOfBoulders: number,
  numberOfTracks: number,
  grades: GradeEnum[],
}

export type Parking = {
  id: number,
  location: GeoCoordinates,
  placeNumber?: number,
  description?: string,
  image?: ImageAfterServer,
};

export type Journey = {
  id: number,
};

export type Sector = {
  id: number,
  name: string,
  description?: string,
  boulders?: Boulder[],
  wayPoints?: Waypoint[],
};

export type Waypoint = {
  id: number,
  name: string,
  location: GeoCoordinates,
  image?: ImageAfterServer,
  description?: string,
};

export type Boulder = {
  id: number,
  orderIndex: number,
  name: string,
  location: GeoCoordinates,
  isHighBall?: boolean,
  isMustSee?: boolean,
  hasDangerousDescent?: boolean,
  images?: ImageAfterServer[],
  tracks?: Track[],
};

export type Track = {
  id: number,
  orderIndex: number,
  creatorId: number,
  name: string,
  isTraverse?: boolean,
  isSittingStart?: boolean,
  anchorNumber?: number,
  grade?: GradeEnum,
  description?: string,
  receptionId?: number,
  techniqueIds?: number[],
  height?: number,
  orientationId?: number,
  lines?: Line[],
  note?: number,
};

export type Line = {
  id: number,
  boulderImageId: number,
  boulderImageDimensions: ImageDimension,
  linePoints?: Coordinates[],
  handDeparturePoints?: Coordinates[],
  feetDeparturePoints?: Coordinates[],
  anchorPoints?: Coordinates[],
  forbiddenAreas?: Area[],
};

export type Grade = 3 | 4 | 5 | 6 | 7 | 8 | 9;
