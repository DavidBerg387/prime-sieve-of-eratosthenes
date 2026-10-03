import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sieveOfEratosthenes, isPrime, primeCount } from '../src/index.js';

describe('sieveOfEratosthenes', () => {
  it('returns an empty array for limit 0', () => {
    assert.deepEqual(sieveOfEratosthenes(0), []);
  });

  it('returns an empty array for limit 1', () => {
    assert.deepEqual(sieveOfEratosthenes(1), []);
  });

  it('returns [2] for limit 2 (inclusive bound)', () => {
    assert.deepEqual(sieveOfEratosthenes(2), [2]);
  });

  it('includes the limit when the limit itself is prime', () => {
    assert.deepEqual(sieveOfEratosthenes(13), [2, 3, 5, 7, 11, 13]);
  });

  it('excludes the limit when the limit is composite', () => {
    assert.deepEqual(sieveOfEratosthenes(15), [2, 3, 5, 7, 11, 13]);
  });

  it('matches the known prime count up to 100', () => {
    const primes = sieveOfEratosthenes(100);
    assert.equal(primes.length, 25);
    assert.equal(primes[0], 2);
    assert.equal(primes[primes.length - 1], 97);
    // Spot-check that every returned number is actually coprime-free.
    for (const p of primes) {
      for (const q of primes) {
        if (p !== q) assert.notEqual(p % q, 0);
      }
    }
  });

  it('returns strictly ascending values', () => {
    const primes = sieveOfEratosthenes(50);
    for (let i = 1; i < primes.length; i++) {
      assert.ok(primes[i] > primes[i - 1]);
    }
  });

  it('throws RangeError for negative limits', () => {
    assert.throws(() => sieveOfEratosthenes(-1), RangeError);
  });

  it('throws RangeError for non-integer limits', () => {
    assert.throws(() => sieveOfEratosthenes(10.5), RangeError);
  });

  it('throws RangeError for NaN', () => {
    assert.throws(() => sieveOfEratosthenes(NaN), RangeError);
  });
});

describe('isPrime', () => {
  it('returns false for 0, 1, and negatives', () => {
    assert.equal(isPrime(0), false);
    assert.equal(isPrime(1), false);
    assert.equal(isPrime(-7), false);
  });

  it('returns true for 2 and 3', () => {
    assert.equal(isPrime(2), true);
    assert.equal(isPrime(3), true);
  });

  it('returns false for small composites', () => {
    assert.equal(isPrime(4), false);
    assert.equal(isPrime(9), false);
    assert.equal(isPrime(15), false);
    assert.equal(isPrime(49), false);
  });

  it('agrees with the sieve for every number up to 200', () => {
    const set = new Set(sieveOfEratosthenes(200));
    for (let n = 0; n <= 200; n++) {
      assert.equal(isPrime(n), set.has(n), `mismatch at ${n}`);
    }
  });

  it('throws RangeError for non-safe-integers', () => {
    assert.throws(() => isPrime(Number.MAX_SAFE_INTEGER + 1), RangeError);
    assert.throws(() => isPrime(2.5), RangeError);
    assert.throws(() => isPrime(NaN), RangeError);
  });
});

describe('primeCount', () => {
  it('returns 0 for limits below 2', () => {
    assert.equal(primeCount(0), 0);
    assert.equal(primeCount(1), 0);
  });

  it('matches sieveOfEratosthenes(n).length across a range', () => {
    for (const n of [2, 3, 4, 10, 100, 1000]) {
      assert.equal(primeCount(n), sieveOfEratosthenes(n).length, `mismatch at ${n}`);
    }
  });

  it('throws RangeError for negative limits', () => {
    assert.throws(() => primeCount(-5), RangeError);
  });
});
