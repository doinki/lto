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

  test('random with negative range', () => {
    for (let i = 0; i < 1000; ++i) {
      const number = random(-10, -5);

      expect(number).toBeGreaterThanOrEqual(-10);
      expect(number).toBeLessThanOrEqual(-5);
      expect(Number.isInteger(number)).toBe(true);
    }
  });

  test('random with range spanning zero', () => {
    for (let i = 0; i < 1000; ++i) {
      const number = random(-5, 5);

      expect(number).toBeGreaterThanOrEqual(-5);
      expect(number).toBeLessThanOrEqual(5);
      expect(Number.isInteger(number)).toBe(true);
    }
  });

  test('random with min === max returns the value', () => {
    expect(random(7, 7)).toBe(7);
    expect(random(-3, -3)).toBe(-3);
  });

  test('random throws TypeError when min is not a safe integer', () => {
    expect(() => random(1.5, 10)).toThrow(TypeError);
    expect(() => random(Number.NaN, 10)).toThrow(TypeError);
    expect(() => random(Number.POSITIVE_INFINITY, 10)).toThrow(TypeError);
    expect(() => random(Number.MAX_SAFE_INTEGER + 1, Number.MAX_SAFE_INTEGER + 10)).toThrow(TypeError);
  });

  test('random throws TypeError when max is not a safe integer', () => {
    expect(() => random(1, 10.5)).toThrow(TypeError);
    expect(() => random(1, Number.NaN)).toThrow(TypeError);
    expect(() => random(1, Number.NEGATIVE_INFINITY)).toThrow(TypeError);
    expect(() => random(1, Number.MAX_SAFE_INTEGER + 1)).toThrow(TypeError);
  });

  test('random accepts safe integer boundaries', () => {
    expect(() => random(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).not.toThrow();
    expect(() => random(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).not.toThrow();
    expect(random(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('random throws RangeError when min > max', () => {
    expect(() => random(10, 5)).toThrow(RangeError);
    expect(() => random(5, 4)).toThrow(RangeError);
    expect(() => random(0, -1)).toThrow(RangeError);
  });

  test('random throws RangeError when range exceeds 2^32', () => {
    expect(() => random(0, 2 ** 32)).toThrow(RangeError);
    expect(() => random(-1, 2 ** 32 - 1)).toThrow(RangeError);
  });

  test('create', () => {
    const lto = create();

    expect(lto.length).toBe(6);
    expect(lto.every((number) => number >= MIN_NUMBER && number <= MAX_NUMBER)).toBe(true);
    expect(lto.every((number, index, array) => index === 0 || number > array[index - 1])).toBe(true);
  });
});
