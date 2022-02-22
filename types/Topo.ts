import type { QuarkArray } from 'helpers/quarky';
import type { Amenities, ClimbTechniques, RockTypes } from './Bitflags';
import type {
  Reception, Grade, LightGrade, Orientation, TopoStatus, TopoType, Difficulty,
} from './Enums';
import type { LinearRing, LineCoords, Position } from './GeoJson';
import type { UUID, GeoCoordinates, RequireAtLeastOne, StringBetween, Name, Description } from './Utils';
import type { TrackRating, User } from './User';
import type { Image } from './Image';

export type Topo = Omit<TopoData, 'sectors' | 'boulders' | 'waypoints' | 'parkings' | 'accesses' | 'managers'> & {
  sectors: QuarkArray<Sector>,
  boulders: QuarkArray<Boulder>,
  waypoints: QuarkArray<Waypoint>,
  parkings: QuarkArray<Parking>,
  accesses: QuarkArray<TopoAccess>,
  managers: QuarkArray<Manager>,
};

export type Sector = SectorData;

export type Boulder = Omit<BoulderData, 'tracks'> & {
  tracks: QuarkArray<Track>,
};

export type Track = Omit<TrackData, 'ratings' | 'lines'> & {
  ratings: QuarkArray<TrackRating>,
  lines: QuarkArray<Line>
};

export interface TopoData {
  readonly id: UUID,
  name: Name,
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
  otherAmenities?: Description

  creatorId: UUID,
  creatorPseudo: Name,
  validatorId?: UUID,
  image?: Image,

  closestCity?: Name,
  altitude?: number,
  description?: Description,
  faunaProtection?: Description,
  ethics?: Description,
  danger?: Description

  sectors: SectorData[], // -> Quark<Array<Quark<Sector>>>
  boulders: BoulderData[],
  lonelyBoulders: UUID[],
  waypoints: Waypoint[]
  parkings: Parking[],
  accesses: TopoAccess[],
  managers: Manager[],
}

export type LightTopo = Omit<TopoData, 'sectors' | 'boulders' | 'waypoints' | 'parkings' | 'accesses' | 'managers'> & {
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
  danger?: Description,
  difficulty?: Difficulty,
  duration?: number,
  steps?: TopoAccessStep[],
}, 'danger' | 'difficulty' | 'duration' | 'steps' >;

export interface TopoAccessStep {
  description: Description
  image?: Image,
}

export interface Parking {
  readonly id: UUID,
  spaces: number,
  location: GeoCoordinates,
  name?: Name,
  description?: Description
  image?: Image
}

export interface Manager {
  readonly id: UUID,
  name: Name,
  description?: Description
  image?: Image
  adress?: StringBetween<1, 2000>,
  zip?: number,
  city?: Name,
  contactName: Name,
  contactPhone?: Name,
  contactMail?: Name,
}

export interface SectorData {
  readonly id: UUID,
  name: Name,
  path: GeoCoordinates[],
  boulders: UUID[],
}

export interface Waypoint {
  readonly id: UUID,
  sectorId?: UUID,
  name: Name,
  location: GeoCoordinates,
  image?: Image,
  description?: Description,
}

export interface BoulderData {
  readonly id: UUID,
  location: GeoCoordinates,
  name: Name,
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
  name?: Name,
  description?: Description,
  height?: number,
  grade?: Grade,

  nbAnchors?: number,
  techniques?: ClimbTechniques,
  reception?: Reception,
  orientation?: Orientation,
  isTraverse: boolean,
  isSittingStart: boolean,
  mustSee: boolean
  hasMantle?: boolean,

  lines: Line[],
  ratings: TrackRating[],
  // optional, if the creator's profile was deleted
  creatorId?: UUID,
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
