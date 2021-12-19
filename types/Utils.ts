export type GeoCoordinates = {
  lat: number,
  lng: number,
};

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

export type NumberBetween<Min, Max> = number & {
  readonly _phantom: unique symbol
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

export function numberBetween<Min extends number, Max extends number>(
  x: number,
  min: Min,
  max: Max,
): NumberBetween<Min, Max> | null {
  if (isBetween(x, min, max)) {
    return x;
  }
  return null;
}

export type StringBetween<Min extends number, Max extends number> = string & {
  readonly _phantom: unique symbol
};

export function isStringBetween<Min extends number, Max extends number>(
  s: string,
  min: Min,
  max: Max
): s is StringBetween<Min, Max> {
  return min <= s.length && s.length < max;
}

export function stringBetween<Min extends number, Max extends number>(
  s: string,
  min: Min,
  max: Max
): StringBetween<Min, Max> | null {
  if (isStringBetween(s, min, max)) {
    return s;
  }
  return null;
}