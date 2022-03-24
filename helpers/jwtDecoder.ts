import { Role } from "types";

// Contains more, but we only need those
export type AccessJWT = {
  sub: string, // UUID
  exp: number, // expiry date, in seconds
  email: string,
  user_metadata: { role: Role }
}

export const jwtDecoder = (jwt: string) =>
  JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8'));