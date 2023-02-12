import type { ColumnType } from "kysely";
import { UUID } from "types";

export type ContributorRole = "ADMIN" | "CONTRIBUTOR";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Grade = "3" | "3+" | "4" | "4+" | "5a" | "5a+" | "5b" | "5b+" | "5c" | "5c+" | "6a" | "6a+" | "6b" | "6b+" | "6c" | "6c+" | "7a" | "7a+" | "7b" | "7b+" | "7c" | "7c+" | "8a" | "8a+" | "8b" | "8b+" | "8c" | "8c+" | "9a" | "9a+" | "9b" | "9b+" | "9c" | "9c+";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Image {
  id: UUID,
  ratio: number,
  placeholder?: string | null
}

export interface BoulderLikes {
  boulderId: string;
  userId: string;
  created: Generated<Timestamp>;
}

export interface Boulders {
  id: string;
  location: string;
  name: string;
  isHighball: Generated<boolean>;
  mustSee: Generated<boolean>;
  dangerousDescent: Generated<boolean>;
  images: Generated<string[]>;
  topoId: string;
}

export interface Images {
  id: string;
  ratio: number | null;
  placeholder: string | null;
}

export interface Lines {
  id: string;
  index: number;
  points: number[];
  forbidden: string | null;
  hand1: string | null;
  hand2: string | null;
  foot1: string | null;
  foot2: string | null;
  imageId: string | null;
  topoId: string;
  trackId: string;
}

export interface Managers {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string | null;
  contactMail: string | null;
  description: string | null;
  address: string | null;
  zip: number | null;
  city: string | null;
  topoId: string;
  image: string | null;
}

export interface Parkings {
  id: string;
  spaces: number;
  location: string;
  name: string | null;
  description: string | null;
  topoId: string;
  image: string | null;
}

export interface Sectors {
  id: string;
  index: number;
  name: string;
  path: string;
  boulders: string[];
  topoId: string;
}

export interface TopoAccesses {
  id: string;
  danger: string | null;
  difficulty: number | null;
  duration: number | null;
  steps: string[];
  topoId: string;
}

export interface TopoContributors {
  topoId: string;
  userId: string;
  role: ContributorRole;
}

export interface TopoLikes {
  topoId: string;
  userId: string;
  created: Generated<Timestamp>;
}

export interface Topos {
  id: string;
  name: string;
  status: number;
  location: string;
  forbidden: boolean;
  modified: Generated<Timestamp>;
  submitted: Timestamp | null;
  validated: Timestamp | null;
  amenities: Generated<number>;
  rockTypes: Generated<number>;
  type: number | null;
  description: string | null;
  faunaProtection: string | null;
  ethics: string | null;
  danger: string | null;
  cleaned: Timestamp | null;
  altitude: number | null;
  closestCity: string | null;
  otherAmenities: string | null;
  lonelyBoulders: Generated<string[]>;
  image: string | null;
  creatorId: string;
  validatorId: string | null;
}

export interface TrackRatings {
  id: string;
  finished: boolean;
  rating: number;
  comment: string | null;
  created: Generated<Timestamp>;
  modified: Generated<Timestamp>;
  topoId: string;
  trackId: string;
  authorId: string;
}

export interface Tracks {
  id: string;
  index: number;
  name: string | null;
  description: string | null;
  height: number | null;
  grade: Grade | null;
  orientation: number | null;
  reception: number | null;
  anchors: number | null;
  techniques: Generated<number>;
  isTraverse: Generated<boolean>;
  isSittingStart: Generated<boolean>;
  mustSee: Generated<boolean>;
  hasMantle: Generated<boolean>;
  topoId: string;
  boulderId: string;
  creatorId: string;
}

export interface Waypoints {
  id: string;
  name: string;
  location: string;
  description: string | null;
  topoId: string;
  image: string | null;
}

export interface DB {
  boulderLikes: BoulderLikes;
  boulders: Boulders;
  images: Images;
  lines: Lines;
  managers: Managers;
  parkings: Parkings;
  sectors: Sectors;
  topoAccesses: TopoAccesses;
  topoContributors: TopoContributors;
  topoLikes: TopoLikes;
  topos: Topos;
  trackRatings: TrackRatings;
  tracks: Tracks;
  waypoints: Waypoints;
}
