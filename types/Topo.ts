import { Amenities, ClimbTechniques, RockTypes } from './Bitflags';
import {
  Difficulty, Grade, LightGrade, Orientation, TopoStatus, TopoType,
} from './Enums';
import { LinearRing, LineCoords, Position } from './GeoJson';
import { GeoCoordinates, StringBetween } from './Utils';
import { UUID } from './UUID';
import { TrackRating, User } from './User';
import { Image } from './Image';

export interface Topo {
  id: UUID,
  name: StringBetween<1, 255>,
  // Creation = first validation
  validatedAt?: Date,
  submittedAt?: Date,
  // IMPORTANT: modifying anything in a topo changes the last modified at
  modifiedAt?: Date,
  cleaned?: Date,
  status: TopoStatus,
  type: TopoType,
  isForbidden: boolean,

  location: GeoCoordinates,
  rockTypes: RockTypes,
  amenities: Amenities,
  otherAmenities?: StringBetween<1, 5000>

  creator?: User,
  validator?: User,
  image?: Image

  closestCity?: string,
  altitude?: number,
  description?: StringBetween<1, 5000>,
  faunaProtection?: StringBetween<1, 5000>,
  ethics?: StringBetween<1, 5000>,
  danger?: StringBetween<1, 5000>

  sectors: Sector[],
  parkings: Parking[],
  access: TopoAccess[],
}

export interface LightTopo {
  id: UUID,
  name: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>,
  image?: Image,
  nbBoulders: number,
  nbTracks: number,
  grades: GradeHistogram,
  status: TopoStatus,
  validatedAt?: Date,
  submittedAt?: Date,
  // IMPORTANT: modifying anything in a topo changes the last modified at
  modifiedAt?: Date,
}

export type GradeHistogram = {
  [K in LightGrade]: number
};

// TODO: require at least one
export interface TopoAccess {
  id: UUID,
  duration?: number,
  difficulty?: Difficulty,
  danger?: StringBetween<1, 5000>,
  steps: TopoAccessStep[],
}

export interface TopoAccessStep {
  description: StringBetween<1, 5000>
  image?: Image,
}

export interface Parking {
  id: UUID,
  spaces: number,
  location: GeoCoordinates,
  name?: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>
  image?: Image
}

export interface Sector {
  id: UUID,
  name: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>

  boulders: Boulder[],
  waypoints: Waypoint[]
}

export interface Waypoint {
  id: UUID,
  name: StringBetween<1, 255>,
  location: GeoCoordinates,
  image?: Image,
  description?: StringBetween<1, 5000>,
}

export interface Boulder {
  id: UUID,
  location: GeoCoordinates,
  name: StringBetween<1, 255>,
  isHighball: boolean,
  mustSee: boolean,
  orderIndex: number,
  descent?: Difficulty,

  tracks: Track[],
  // can be cross-referenced by lines within each track
  images: Image[]
}

// Order defined by the x-coordinate of the first point of the first line
export interface Track {
  id: UUID,
  name?: StringBetween<1, 255>,
  description?: StringBetween<1, 5000>,
  height?: number,
  grade?: Grade,

  nbAnchors?: number,
  techniques: ClimbTechniques,
  reception?: Difficulty,
  orientation?: Orientation,
  isTraverse?: boolean,
  isSittingStart?: boolean,
  hasMantle?: boolean,

  lines: Line[],
  ratings: TrackRating[],
  // TODO: how to avoid creating a ton of copies of User objects
  // when deserializing an API result?
  creator: User,
}

export interface Line {
  id: UUID,
  points: LineCoords,
  // a LinearRing delineates the contour of a polygon
  forbidden: LinearRing[],
  // Starting points = max 2 for hand, max 2 for feet
  // Could not find a way to represent an array of length <= 2 in TypeScript types
  handDepartures: Position[],
  feetDepartures: Position[],

  trackId: UUID,
  // the images are provided with the boulder
  imageId: UUID
}