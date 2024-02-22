import { getRandomValues } from 'node:crypto';

export const MAX_NUMBER = 45;
export const MIN_NUMBER = 1;

export function random(): number {
  const [value] = getRandomValues(new Uint32Array(1));

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
