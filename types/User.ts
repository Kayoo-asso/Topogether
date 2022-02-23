import { Image, Rating } from 'types';
import { Description, Email, ExplicitUndefineds, Name, StringBetween, UUID } from './Utils';

export type User = {
  id: UUID,
  pseudo: Name,
  email: Email,
  readonly role: Role,
  readonly created: Date,
  imageUrl?: string,
  firstName?: Name,
  lastName?: Name,
  country?: Name,
  city?: Name,
  phone?: StringBetween<1, 30>,
  birthDate?: Date,
};

// The values that can be updated in the database
// NOTE: the email has to be updated through the authentication service
export interface DBUser {
  id: UUID,
  user_name: Name,
  email: Email, // cannot be updated directly
  role: Role, // cannot be updated directly
  created: string,
  image_url?: string,
  first_name?: Name,
  last_name?: Name,
  country?: Name,
  city?: Name,
  phone?: StringBetween<1, 30>,
  birth?: string,
}

export type DBUserUpdate = ExplicitUndefineds<Omit<DBUser, 'email' | 'role' | 'created'>>;

export interface DBProfile {
  pseudo: Name,
  first_name?: Name,
  last_name?: Name,
  country?: Name,
  city?: Name
}

export type Role = 'ADMIN' | 'USER';

export interface TrackRating {
  id: UUID,
  authorId: UUID,
  finished: boolean,
  rating: Rating,
  comment?: Description,
}
