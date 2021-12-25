import { Amenities, ClimbTechniques, RockTypes } from './Bitflags';
import {
  Difficulty, Grade, LightGrade, Orientation, TopoStatus, TopoType,
} from './Enums';
import { LinearRing, LineCoords, Position } from './GeoJson';
import { GeoCoordinates, StringBetween } from './Utils';
import { UUID } from './UUID';
import { TrackRating } from './User';
import { Image, ImageDimensions } from './Image';

export interface Topo {
  id: UUID,
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
  image?: Image

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
  ratings?: TrackRating[],
  // TODO: how to avoid creating a ton of copies of User objects
  // when deserializing an API result?
  creatorId: UUID,
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