import { getRandomValues } from 'node:crypto';

export const MAX_NUMBER = 45;
export const MIN_NUMBER = 1;

// eslint-disable-next-line unicorn/numeric-separators-style
const MAX_UINT32 = 0xffffffff;
const THRESHOLD = Math.trunc(MAX_UINT32 / MAX_NUMBER) * MAX_NUMBER;

export function random(): number {
  let value: number;
  do {
    value = getRandomValues(new Uint32Array(1))[0]!;
  } while (value >= THRESHOLD);

  return (value % MAX_NUMBER) + MIN_NUMBER;
}

export type Lto = [number, number, number, number, number, number];

export function create(): Lto {
  const set = new Set<number>();

  while (set.size < 6) {
    set.add(random());
  }

  return [...set].sort((a, b) => a - b) as Lto;
}
