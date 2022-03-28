export type GeoCoordinates = [lng: number, lat: number];

export type Result<Success, Error> = {
  type: 'success'
  value: Success
} | {
  type: 'error',
  error: Error
};

export type Name = StringBetween<1, 500>;
export type Description = StringBetween<1, 5000>;

export type NumberBetween<Min, Max> = number & {
  readonly _phantom: unique symbol
};

export type StringBetween<Min extends number, Max extends number> = string & {
  readonly _phantom: unique symbol
};

export type Email = string & {
  readonly _isEmail: unique symbol
};

export type UUID = string & {
  readonly _isUUID: unique symbol
};

export function isBetween<Min extends number, Max extends number>(
  x: number,
  min: Min,
  max: Max,
): x is NumberBetween<Min, Max> {
  if (min <= x && x < max) {
    return true;
  }
  return false;
}

export function isStringBetween<Min extends number, Max extends number>(
  s: string,
  min: Min,
  max: Max
): s is StringBetween<Min, Max> {
  return min <= s.length && s.length < max;
}

export function isName(name: string): name is Name {
  return isStringBetween(name, 1, 500);
}

export function isDescription(description: string): description is Description {
  return isStringBetween(description, 1, 5000);
}

// Email and UUID regexes taken from zod
// https://github.com/colinhacks/zod/blob/master/src/types.ts
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const uuidRegex =
  /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;

export function isEmail(s: string): s is Email {
  return emailRegex.test(s);
}

export function isUUID(s: string): s is UUID {
  return uuidRegex.test(s);
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys];

export type RequireKeys<T, Keys extends keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: T[K]
  }

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?:
    Required<Pick<T, K>>
    & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys];

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K
}[keyof T]

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never
}[keyof T]

type PickRequired<T> = Pick<T, RequiredKeys<T>>

type PickOptional<T> = Pick<T, OptionalKeys<T>>

type Nullable<T> = { [P in keyof T]-?: T[P] | null }

export type NullableOptional<T> = PickRequired<T> & Nullable<PickOptional<T>>