import { NumberBetween } from 'types';
import { isBetween } from './isBetween';

export function numberBetween<Min extends number, Max extends number>(
  x: number,
  min:Min,
  max: Max,
) : NumberBetween<Min, Max> | null {
  if (isBetween(x, min, max)) {
    return x;
  }
  return null;
}
