import { Rating } from 'types';
import { Description, Email, Name, NullableOptional, StringBetween, UUID } from './Utils';

// NOTE: the email has to be updated through the authentication service
export interface BasicUser {
  id: UUID,
  email: Email,
  userName: Name,
}

export type User = {
  id: UUID,
  userName: Name,
  email: Email,
  readonly role: Role,
  // ISO timestamp format
  // Wrap in a new Date() object if needed
  readonly created: string, 
  firstName?: Name,
  lastName?: Name,
  country?: Name,
  city?: Name,
  phone?: StringBetween<1, 30>,
  birthDate?: string, // has to be in YYYY-MM-DD format
  imagePath?: string,
};

export type DBUser = NullableOptional<User>;

export interface Profile {
  id: UUID,
  userName: Name,
  role: Role,
  created: string,
  firstName?: Name,
  lastName?: Name,
  city?: Name,
  country?: Name,
  imagePath?: string,
}

export type Role = 'ADMIN' | 'USER';

export interface TrackRating {
  id: UUID,
  finished: boolean,
  rating: Rating,
  comment?: Description,
  authorId: UUID,
}

export type DBTrackRating = NullableOptional<TrackRating & {
  trackId: UUID
}>;
