export type GeoCoordinates = {
  lat: number,
  lng: number,
};

export type Name = StringBetween<1, 512>;
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

// taken from zod
// https://github.com/colinhacks/zod/blob/master/src/types.ts#L424
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function isEmail(s: string): s is Email {
  return emailRegex.test(s);
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