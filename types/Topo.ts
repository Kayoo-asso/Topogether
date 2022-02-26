import type { QuarkArray } from 'helpers/quarky';
import type { Amenities, ClimbTechniques, RockTypes } from './Bitflags';
import type {
  Reception, Grade, LightGrade, Orientation, TopoStatus, TopoType, Difficulty,
} from './Enums';
import type { LinearRing, LineString, MultiPolygon, Point, Polygon, Position } from './GeoJson';
import type { UUID, GeoCoordinates, RequireAtLeastOne, StringBetween, Name, Description, Email } from './Utils';
import type { TrackRating } from './User';
import type { Image } from './Image';
// import { UUIDSchema } from './schemas/PrimitiveSchemas';

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

export interface DBTopo {
  id: UUID,
  name: Name,
  status: TopoStatus,
  type: TopoType,
  location: Point,
  forbidden: boolean,

  // Timestamps, wrap them in a Date if needed.
  // these describe the topo data in the app
  modified: string,
  submitted?: string,
  validated?: string,
  // this one is about the physical place
  cleaned?: string, 

  amenities: Amenities,
  rockTypes: RockTypes,

  description?: Description,
  faunaProtection?: Description,
  ethics?: Description,
  danger?: Description,
  altitude?: number,
  approachTime?: number,
  otherAmenities?: Description,

  lonelyBoulders: UUID[],

  imageUrl?: string,

  // these can be null, in case the person's account is deleted
  creatorId?: UUID,
  validatorId?: UUID,
}

export type LightTopo = Omit<TopoData, 'sectors' | 'boulders' | 'lonelyBoulders' | 'waypoints' | 'parkings' | 'accesses' | 'managers'> & {
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

export interface Manager {
  readonly id: UUID,
  name: Name,
  contactName: Name,
  contactPhone?: StringBetween<1, 30>,
  contactMail?: Name,
  description?: Description
  adress?: Description,
  zip?: number,
  city?: Name,
  imageUrl?: string
}

export interface DBManager {
  id: UUID,
  name: Name,
  contactName: Name,
  contactPhone?: StringBetween<1, 30>,
  contactMail?: Email,
  description?: Description,
  address?: Description,
  zip?: number,
  city?: Name,
  imageUrl?: string,

  topoId: UUID,
}

// TODO: is the RequireAtLeastOne correct?
export type TopoAccess = RequireAtLeastOne<{
  readonly id: UUID,
  danger?: Description,
  difficulty?: Difficulty,
  duration?: number,
  steps: TopoAccessStep[],
}, 'danger' | 'difficulty' | 'duration' | 'steps' >;

export interface TopoAccessStep {
  description: Description
  imageUrl?: string,
}

export interface DBTopoAccess {
  id: UUID,
  duration?: number,
  danger?: Description,
  difficulty?: Difficulty,
  steps: TopoAccessStep[], // this is required and WILL be validated in the DB
  topoId: UUID
}


export interface Parking {
  readonly id: UUID,
  spaces: number,
  location: GeoCoordinates,
  name?: Name,
  description?: Description
  image?: Image
}

export interface DBParking {
  id: UUID,
  spaces: number,
  location: Point,
  description?: Description,
  imageUrl?: string,

  topoId: UUID,
}

export interface Waypoint {
  readonly id: UUID,
  name: Name,
  location: GeoCoordinates,
  image?: Image,
  description?: Description,
}

export interface DBWaypoint {
  id: UUID,
  name: Name,
  location: Point,
  description?: Description,
  imageUrl?: string,

  topoId: UUID,
}

export interface SectorData {
  readonly id: UUID,
  name: Name,
  path: GeoCoordinates[],
  boulders: UUID[],
}

export interface DBSector {
  id: UUID,
  name: Name,
  path: Polygon,

  topoId: UUID,
  imageId?: UUID,
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

export interface DBBoulder {
  id: UUID,
  location: Point,
  name: Name,
  isHighball: boolean,
  mustSee: boolean,
  dangerousDescent: boolean,

  topoId: UUID,
}

// Order defined by the x-coordinate of the first point of the first line
export interface TrackData {
  readonly id: UUID,
  index: number,

  name?: Name,
  description?: Description,
  height?: number,
  grade?: Grade,
  orientation?: Orientation,
  reception?: Reception,
  anchors?: number,
  techniques?: ClimbTechniques,

  isTraverse: boolean,
  isSittingStart: boolean,
  mustSee: boolean
  hasMantle: boolean,

  lines: Line[],
  ratings: TrackRating[],
  // optional, if the creator's profile was deleted
  creatorId?: UUID,
}

export interface DBTrack {
  id: UUID,
  index: number,

  name?: Name,
  description?: Description,
  height?: number,
  grade?: Grade,
  orientation?: Orientation,
  reception?: Difficulty,
  anchors?: number,
  techniques?: ClimbTechniques,

  isTraverse: boolean,
  isSittingStart: boolean,
  mustSee?: boolean,
  hasMantle?: boolean,

  topoId: UUID,
  boulderId: UUID,
  creatorId?: UUID,
}

export interface Line {
  readonly id: UUID,
  order: number,
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

export interface DBLine {
  id: UUID,
  order: number,
  points: LineString, // linestring
  forbidden: MultiPolygon, // multipolygon
  hand1: Point,
  hand2: Point,
  foot1: Point,
  foot2: Point,

  topoId: UUID,
  trackId: UUID,
  imageId: UUID,
}
