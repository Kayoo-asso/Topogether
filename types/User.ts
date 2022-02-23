import { Image, Rating } from 'types';
import { Description, Email, Name, StringBetween, UUID } from './Utils';

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
// Same for the password
export interface UserUpdate {
  id: UUID,
  pseudo: Name,
  imageUrl?: string,
  firstName?: Name,
  lastName?: Name,
  country?: Name,
  city?: Name,
  phone?: StringBetween<1, 30>,
  birth?: Date,
}

export interface PublicProfile {
  pseudo: Name,
  firstName?: Name,
  lastName?: Name,
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
