import { BoulderImage, Rating } from 'types';
import { Description, Email, ExplicitUndefineds, Name, StringBetween, UUID } from './Utils';

// NOTE: the email has to be updated through the authentication service
export type User = {
  id: UUID,
  userName: Name,
  email: Email,
  readonly role: Role,
  // ISO timestamp format
  // Wrap in a new Date() object if needed
  readonly created: string, 
  imageUrl?: string,
  firstName?: Name,
  lastName?: Name,
  country?: Name,
  city?: Name,
  phone?: StringBetween<1, 30>,
  birthDate?: string, // has to be in YYYY/MM/DD format
};

export interface Profile {
  id: UUID,
  userName: Name,
  role: Role,
  created: string,
  firstName?: Name,
  lastName?: Name,
  city?: Name,
  country?: Name
}

export type Role = 'ADMIN' | 'USER';

export interface TrackRating {
  id: UUID,
  authorId: UUID,
  finished: boolean,
  rating: Rating,
  comment?: Description,
}
