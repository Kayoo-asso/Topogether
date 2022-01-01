import { Amenities, ClimbTechniques, RockTypes } from './Bitflags';
import {
  Difficulty, Grade, LightGrade, Orientation, TopoStatus, TopoType,
} from './Enums';
import { LinearRing, LineCoords, Position } from './GeoJson';
import { GeoCoordinates, RequireAtLeastOne, StringBetween } from './Utils';
import { UUID } from './UUID';
import { TrackRating, User } from './User';
import { Image, ImageDimensions } from './Image';
import { Quarkify } from 'helpers/quarky';

export type Entities = Sector | Boulder | Track | Line | Parking | TopoAccess | Image | User | Waypoint | TrackRating;

export interface Topo {
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
  type: TopoType,
  isForbidden: boolean,

  location: GeoCoordinates,
  rockTypes: RockTypes,
  amenities: Amenities,
  otherAmenities?: StringBetween<1, 5000>

  creatorId?: UUID,
  validatorId?: UUID,
  imageId?: UUID,

  closestCity?: StringBetween<1, 255>,
  altitude?: number,
  description?: StringBetween<1, 5000>,
  faunaProtection?: StringBetween<1, 5000>,
  ethics?: StringBetween<1, 5000>,
  danger?: StringBetween<1, 5000>

  sectors: Sector[],
  parkings: Parking[],
  access: TopoAccess[],
}

export type LightTopo = Omit<Topo, 'sectors' | 'parkings' | 'access'> & {
  firstParkingLocation: GeoCoordinates,
  nbSectors: number,
  nbTracks: number,
  nbBoulders: number,
  grades: GradeHistogram,
  // TODO: do we include access information here? Like access difficulty & time
}

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
}, 'danger' | 'difficulty' | 'duration' | 'steps' >

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

export interface Sector {
  readonly id: UUID,
  name: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>

  boulders: Boulder[],
  waypoints: Waypoint[]
}

export interface Waypoint {
  readonly id: UUID,
  name: StringBetween<1, 255>,
  location: GeoCoordinates,
  image?: Image,
  description?: StringBetween<1, 5000>,
}

export interface Boulder {
  readonly id: UUID,
  location: GeoCoordinates,
  name: StringBetween<1, 255>,
  orderIndex: number,
  isHighball?: boolean,
  mustSee?: boolean,
  descent?: Difficulty,

  tracks: Track[],
  // can be cross-referenced by lines within each track
  imageIds: UUID[]
}

// Order defined by the x-coordinate of the first point of the first line
export interface Track {
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
  isTraverse?: boolean,
  isSittingStart?: boolean,
  hasMantle?: boolean,

  lines: Line[],
  ratings: TrackRating[],
  creatorId: UUID,
}

export interface Line {
  readonly id: UUID,
  points: LineCoords,
  // a LinearRing delineates the contour of a polygon
  forbidden?: LinearRing[] | null,
  // Starting points = max 2 for hand, max 2 for feet
  // Could not find a way to represent an array of length <= 2 in TypeScript types
  handDepartures?: Position[] | null,
  feetDepartures?: Position[] | null,

  // the images are provided with the boulder
  imageId: UUID
}