import { Rating } from "types";
import { Img } from "./Img";
import {
	Description,
	Email,
	Name,
	NullableOptional,
	StringBetween,
	UUID,
} from "./Utils";

// NOTE: the email has to be updated through the authentication service

export type User = {
	id: UUID;
	userName: Name;
	email: Email;
	readonly role: Role;
	// ISO timestamp format
	// Wrap in a new Date() object if needed
	// Undefined when :
	// a) connected through token and localStorage fails to provide info
	// n) offline mode, when the account has not yet been sent to the DB
	readonly created?: string;
	firstName?: Name;
	lastName?: Name;
	country?: Name;
	city?: Name;
	phone?: StringBetween<1, 30>;
	birthDate?: string; // has to be in YYYY-MM-DD format
	image?: Img;
};

export type DBUserUpdate = NullableOptional<
	Omit<User, "created" | "role" | "email">
>;

export interface Profile {
	id: UUID;
	userName: Name;
	role: Role;
	created?: string;
	firstName?: Name;
	lastName?: Name;
	city?: Name;
	country?: Name;
	image?: Img;
}

export type Role = "ADMIN" | "USER";
export type ContributorRole = "ADMIN" | "CONTRIBUTOR";

export interface TrackRating {
	id: UUID;
	finished: boolean;
	rating: Rating;
	comment?: Description;
	authorId: UUID;
}

export type DBTrackRating = NullableOptional<
	TrackRating & {
		trackId: UUID;
		topoId: UUID;
	}
>;
