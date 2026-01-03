import { describe, expect, test } from 'vitest';

import { create, MAX_NUMBER, MIN_NUMBER, random } from '../src';

describe('lto', () => {
  test('MAX_NUMBER', () => {
    expect(MAX_NUMBER).toBe(45);
  });

  test('MIN_NUMBER', () => {
    expect(MIN_NUMBER).toBe(1);
  });

  test('random', () => {
    for (let i = 0, length = MAX_NUMBER * 10; i < length; ++i) {
      const number = random(MIN_NUMBER, MAX_NUMBER);

      expect(number).toBeGreaterThanOrEqual(MIN_NUMBER);
      expect(number).toBeLessThanOrEqual(MAX_NUMBER);
      expect(number).toBe(Math.floor(number));
    }
  });

  test('create', () => {
    const lto = create();

    expect(lto.length).toBe(6);
    expect(
      lto.every((number) => number >= MIN_NUMBER && number <= MAX_NUMBER),
    ).toBe(true);
    expect(
      lto.every(
        (number, index, array) => index === 0 || number > array[index - 1],
      ),
    ).toBe(true);
  });
});
