import { Image } from 'types';
import { StringBetween } from './Utils';
import { UUID } from './UUID';

export type User = {
  id: UUID,
  pseudo: string,
  email: string,
  role: string,
  profilePicture?: Image,
  firstName?: string,
  lastName?: string,
  phone?: string,
  birthDate?: string,
  gender?: string,
  citizenship?: string,
  city?: string,
  isAcceptingNewsInfos?: boolean,
  password?: string,
  update?: () => void,
};

export type Role = 'ADMIN' | 'USER';


export interface TrackRating {
  authorId: UUID,
  finished: boolean,
  rating: Rating,
  comment?: StringBetween<1, 5000>,
}

export type Rating = 1 | 2 | 3 | 4 | 5;