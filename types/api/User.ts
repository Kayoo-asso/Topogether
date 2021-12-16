import { StringBetween } from "types/StringBetwen";

export interface User {
    id: bigint,
    pseudo: StringBetween<1, 255>,
    email: StringBetween<0, 1000>,
    role: UserRole,
    created: Date,
    firstName?: StringBetween<1, 500>,
    lastName?: StringBetween<1, 500>

    // TODO: convert to proper Image object?
    profileId?: bigint
}

export enum UserRole {
    User,
    Admin
}