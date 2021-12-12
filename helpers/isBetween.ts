import { NumberBetween } from 'types';

export function isBetween<Min extends number, Max extends number>(
  x: number,
  min: Min,
  max: Max,
) : x is NumberBetween<Min, Max> {
  if (min <= x && x < max) {
    return true;
  }
  return false;
}