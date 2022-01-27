import { Image, Rating } from 'types';
import { Description, Email, Name, StringBetween, UUID } from './Utils';

export type User = {
  id: UUID,
  pseudo: Name,
  email: Email,
  role: Role,
  image?: Image,
  firstName?: Name,
  lastName?: Name,
  birthDate?: Date,
  citizenship?: Name,
  city?: Name,
  isAcceptingNewsInfos?: boolean,
  // phone?: string,
  // gender?: string,
  // password?: string,
};

export type Role = 'ADMIN' | 'USER';

export interface TrackRating {
  id: UUID,
  authorId: UUID,
  finished: boolean,
  rating: Rating,
  comment?: Description,
}
