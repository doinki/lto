import { getRandomValues } from 'node:crypto';

export const MAX_NUMBER = 45;
export const MIN_NUMBER = 1;

// eslint-disable-next-line unicorn/numeric-separators-style
const MAX_UINT32 = 0xffffffff;

export function random(min: number, max: number): number {
  const range = max - min + 1;
  const threshold = Math.trunc(MAX_UINT32 / range) * range;

  let value: number;
  do {
    value = getRandomValues(new Uint32Array(1))[0]!;
  } while (value >= threshold);

  return (value % range) + min;
}

export type Lto = [number, number, number, number, number, number];

export function create(): Lto {
  const set = new Set<number>();

  while (set.size < 6) {
    set.add(random(MIN_NUMBER, MAX_NUMBER));
  }

  return [...set].sort((a, b) => a - b) as Lto;
}
