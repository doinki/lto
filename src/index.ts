import { getRandomValues } from 'node:crypto';

/**
 * The maximum number that can appear on a Lotto 6/45 (로또6/45) ticket.
 */
export const MAX_NUMBER = 45;

/**
 * The minimum number that can appear on a Lotto 6/45 (로또6/45) ticket.
 */
export const MIN_NUMBER = 1;

const UINT32_RANGE = 2 ** 32;
const randomBuffer = new Uint32Array(1);

/**
 * Returns a uniformly distributed random integer in the inclusive range `[min, max]`.
 *
 * Uses cryptographically secure rejection sampling backed by {@link https://nodejs.org/api/crypto.html#cryptogetrandomvaluestypedarray | crypto.getRandomValues}.
 *
 * @param min - Lower bound (inclusive). Must be a safe integer.
 * @param max - Upper bound (inclusive). Must be a safe integer and `>= min`.
 * @returns A random integer in `[min, max]`.
 * @throws {TypeError} If `min` or `max` is not a safe integer.
 * @throws {RangeError} If `min > max`, or if `max - min + 1` exceeds `2 ** 32`.
 *
 * @example
 * ```ts
 * random(1, 45); // e.g. 17
 * random(0, 9);  // e.g. 3
 * ```
 */
export function random(min: number, max: number): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max))
    throw new TypeError('min and max must be safe integers');

  if (min > max) throw new RangeError('min must be less than or equal to max');

  const range = max - min + 1;
  if (range > UINT32_RANGE) throw new RangeError('range (max - min + 1) must not exceed 2^32');

  const threshold = UINT32_RANGE - (UINT32_RANGE % range);

  let value: number;
  do {
    getRandomValues(randomBuffer);
    value = randomBuffer[0]!;
  } while (value >= threshold);

  return (value % range) + min;
}

/**
 * A Lotto 6/45 (로또6/45) ticket: a tuple of six unique integers in `[1, 45]`, sorted ascending.
 */
export type Lto = [number, number, number, number, number, number];

/**
 * Generates a single Lotto 6/45 (로또6/45) ticket.
 *
 * @returns A tuple of six unique integers from {@link MIN_NUMBER} to {@link MAX_NUMBER}, sorted ascending.
 *
 * @example
 * ```ts
 * create(); // e.g. [3, 11, 17, 24, 36, 42]
 * ```
 */
export function create(): Lto {
  const set = new Set<number>();

  while (set.size < 6) set.add(random(MIN_NUMBER, MAX_NUMBER));

  return [...set].sort((a, b) => a - b) as Lto;
}

/**
 * Six digits for a Pension Lottery 720+ (연금복권720+) ticket. Each digit is an integer in `[0, 9]`, duplicates allowed. Does not include the group number (조).
 */
export type PensionLotteryNumbers = [number, number, number, number, number, number];

/**
 * Generates the six digits for a Pension Lottery 720+ (연금복권720+) ticket.
 *
 * Does not generate the group number (조).
 *
 * @returns A tuple of six integers from `0` to `9`, in generation order. Duplicates are allowed.
 *
 * @example
 * ```ts
 * createPensionLotteryNumbers(); // e.g. [4, 0, 7, 7, 1, 9]
 * ```
 */
export function createPensionLotteryNumbers(): PensionLotteryNumbers {
  const numbers: number[] = [];
  for (let i = 0; i < 6; i++) numbers.push(random(0, 9));

  return numbers as PensionLotteryNumbers;
}
