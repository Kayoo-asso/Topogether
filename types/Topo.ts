import type { Quark, QuarkArray } from 'helpers/quarky';
import type { Amenities, ClimbTechniques, RockTypes } from './Bitflags';
import type {
  Difficulty, Grade, LightGrade, Orientation, TopoStatus, TopoType,
} from './Enums';
import type { LinearRing, LineCoords, Position } from './GeoJson';
import type { UUID, GeoCoordinates, RequireAtLeastOne, StringBetween } from './Utils';
import type { TrackRating, User } from './User';
import type { Image } from './Image';

export type Topo = Omit<TopoData, 'sectors' | 'parkings' | 'accesses' | 'managers'> & {
  sectors: QuarkArray<Sector>,
  parkings: QuarkArray<Parking>,
  accesses: QuarkArray<TopoAccess>,
  managers: QuarkArray<Manager>,
};

export type Sector = Omit<SectorData, 'boulders' | 'waypoints'> & {
  boulders: QuarkArray<Boulder>,
  waypoints: QuarkArray<Waypoint>,
};

export type Boulder = Omit<BoulderData, 'tracks'> & {
  tracks: QuarkArray<Track>,
};

export type Track = Omit<TrackData, 'ratings' | 'lines'> & {
  ratings: QuarkArray<TrackRating>,
  lines: QuarkArray<Line>
};

export interface TopoData {
  readonly id: UUID,
  name: StringBetween<1, 255>,
  // Creation = first validation
  submittedAt?: Date,
  validatedAt?: Date,
  // IMPORTANT: modifying anything in a topo changes the last modified at
  // TODO: if someone is editing a topo offline, should we reflect that
  // in the modifiedAt date for them?
  modifiedAt?: Date,
  cleaned?: Date,
  status: TopoStatus,
  type?: TopoType,
  isForbidden: boolean,

  location: GeoCoordinates,
  rockTypes?: RockTypes,
  amenities?: Amenities,
  hasOtherAmenities?: boolean,
  otherAmenities?: StringBetween<1, 5000>

  creatorId: UUID,
  creatorPseudo: StringBetween<1, 255>,
  validatorId?: UUID,
  image?: Image,

  closestCity?: StringBetween<1, 255>,
  altitude?: number,
  description?: StringBetween<1, 5000>,
  faunaProtection?: StringBetween<1, 5000>,
  ethics?: StringBetween<1, 5000>,
  danger?: StringBetween<1, 5000>

  sectors: SectorData[], // -> Quark<Array<Quark<Sector>>>
  parkings: Parking[],
  accesses: TopoAccess[],
  managers: Manager[],
}

export type LightTopo = Omit<TopoData, 'sectors' | 'parkings' | 'accesses' | 'managers'> & {
  firstParkingLocation?: GeoCoordinates,
  nbSectors: number,
  nbTracks: number,
  nbBoulders: number,
  grades: GradeHistogram,
  // TODO: do we include access information here? Like access difficulty & time
};

export type GradeHistogram = {
  [K in LightGrade]: number
} & {
  Total: number
};

// TODO: is the RequireAtLeastOne correct?
export type TopoAccess = RequireAtLeastOne<{
  readonly id: UUID,
  danger?: StringBetween<1, 5000>,
  difficulty?: Difficulty,
  duration?: number,
  steps?: TopoAccessStep[],
}, 'danger' | 'difficulty' | 'duration' | 'steps' >;

export interface TopoAccessStep {
  description: StringBetween<1, 5000>
  image?: Image,
}

export interface Parking {
  readonly id: UUID,
  spaces: number,
  location: GeoCoordinates,
  name?: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>
  image?: Image
}

export interface Manager {
  readonly id: UUID,
  name: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>
  image?: Image
  adress?: StringBetween<1, 255>
  zip?: number,
  city?: StringBetween<1, 255>,
  contactName: StringBetween<1, 255>,
  contactPhone?: StringBetween<1, 255>,
  contactMail?: StringBetween<1, 255>,
}

export interface SectorData {
  readonly id: UUID,
  name: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>

  boulders: BoulderData[],
  waypoints: Waypoint[]
}

export interface Waypoint {
  readonly id: UUID,
  name: StringBetween<1, 255>,
  location: GeoCoordinates,
  image?: Image,
  description?: StringBetween<1, 5000>,
}

export interface BoulderData {
  readonly id: UUID,
  location: GeoCoordinates,
  name: StringBetween<1, 255>,
  orderIndex: number,
  isHighball: boolean,
  mustSee: boolean,
  dangerousDescent: boolean,

  tracks: TrackData[],
  // can be cross-referenced by lines within each track
  images: Image[]
}

// Order defined by the x-coordinate of the first point of the first line
export interface TrackData {
  readonly id: UUID,
  orderIndex: number,
  name?: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>,
  height?: number,
  grade?: Grade,

  nbAnchors?: number,
  techniques?: ClimbTechniques,
  reception?: Difficulty,
  orientation?: Orientation,
  isTraverse: boolean,
  isSittingStart: boolean,
  mustSee: boolean
  hasMantle?: boolean,

  lines: Line[],
  ratings: TrackRating[],
  creatorId: UUID,
}

export interface Line {
  readonly id: UUID,
  points: Position[],
  // a LinearRing delineates the contour of a polygon
  forbidden?: LinearRing[],
  // Starting points = max 2 for hand, max 2 for feet
  // Could not find a way to represent an array of length <= 2 in TypeScript types
  handDepartures?: Position[],
  feetDepartures?: Position[],

  // the images are provided with the boulder
  imageId: UUID
}
