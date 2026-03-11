import { describe, expect, it } from 'vitest';

import { formatCurrency, fromCents, parseAmount, toCents, validateNumberInput } from './currency';

describe('toCents', () => {
  it('converts whole number to cents', () => {
    expect(toCents(10)).toBe(1000);
  });

  it('converts decimal to cents with correct rounding', () => {
    expect(toCents(10.99)).toBe(1099);
    expect(toCents(0.01)).toBe(1);
  });

  it('handles floating point imprecision (e.g. 1.005)', () => {
    // 1.005 * 100 === 100.49999... in IEEE 754, so Math.round gives 100, not 101.
    // This documents the known behaviour — callers should not rely on banker's rounding.
    expect(toCents(1.005)).toBe(100);
  });

  it('converts zero', () => {
    expect(toCents(0)).toBe(0);
  });
});

describe('fromCents', () => {
  it('converts cents back to decimal amount', () => {
    expect(fromCents(1099)).toBe(10.99);
    expect(fromCents(1000)).toBe(10);
  });

  it('converts zero', () => {
    expect(fromCents(0)).toBe(0);
  });

  it('is the inverse of toCents for clean values', () => {
    expect(fromCents(toCents(42.5))).toBe(42.5);
  });
});

describe('formatCurrency', () => {
  it('formats cents as a EUR currency string', () => {
    // de-DE locale: 10,99 €
    expect(formatCurrency(1099)).toMatch(/10[,.]99/);
    expect(formatCurrency(1099)).toMatch(/€/);
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toMatch(/0[,.]00/);
  });

  it('formats large amounts', () => {
    expect(formatCurrency(100000)).toMatch(/1\.000,00|1,000\.00/);
  });

  it('accepts a custom currency', () => {
    const result = formatCurrency(1099, 'USD');
    expect(result).toMatch(/10[,.]99/);
    expect(result).toMatch(/\$|USD/);
  });
});

describe('validateNumberInput', () => {
  it('accepts valid integer input', () => {
    expect(validateNumberInput('100')).toBe(true);
  });

  it('accepts valid decimal input with up to 2 decimal places', () => {
    expect(validateNumberInput('10.99')).toBe(true);
    expect(validateNumberInput('10.9')).toBe(true);
  });

  it('rejects more than 2 decimal places', () => {
    expect(validateNumberInput('10.999')).toBe(false);
  });

  it('rejects letters', () => {
    expect(validateNumberInput('abc')).toBe(false);
    expect(validateNumberInput('10a')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateNumberInput('')).toBe(false);
  });

  it('rejects negative numbers', () => {
    expect(validateNumberInput('-10')).toBe(false);
  });

  it('rejects multiple dots', () => {
    expect(validateNumberInput('10.9.9')).toBe(false);
  });
});

describe('parseAmount', () => {
  it('parses a valid decimal string to cents', () => {
    expect(parseAmount('10.99')).toBe(1099);
  });

  it('parses a whole number string to cents', () => {
    expect(parseAmount('10')).toBe(1000);
  });

  it('strips non-numeric characters before parsing', () => {
    expect(parseAmount('€10.50')).toBe(1050);
  });

  it('returns null for non-numeric input', () => {
    expect(parseAmount('abc')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseAmount('')).toBeNull();
  });

  it('returns 0 cents for zero input', () => {
    // parseAmount only guards NaN, not zero — '0' is a valid numeric input.
    expect(parseAmount('0')).toBe(0);
  });
});
