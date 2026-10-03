/**
 * Sieve of Eratosthenes and related helpers.
 *
 * We use a plain `Uint8Array` of booleans instead of a `Set` or `boolean[]`
 * because the sieve's whole cost is memory bandwidth over a flat bit-table;
 * a typed array of bytes keeps the inner loop cache-friendly and avoids the
 * per-element boxing that `boolean[]` would impose. One byte per cell is
 * acceptable for the limits this library targets; bit-packing would halve
 * memory but roughly halve speed for the small-N cases that dominate usage.
 */

/**
 * Generate every prime number up to and including `limit`.
 *
 * The limit is inclusive: `sieveOfEratosthenes(11)` returns `[2,3,5,7,11]`.
 * We chose inclusive bounds because "all primes up to N" in common usage
 * means "up to and including N when N itself is prime".
 *
 * @param {number} limit - A non-negative integer upper bound (inclusive).
 * @returns {number[]} Primes in ascending order. Empty for limit < 2.
 * @throws {RangeError} If `limit` is not a non-negative integer.
 */
export function sieveOfEratosthenes(limit) {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new RangeError(`limit must be a non-negative integer, got ${String(limit)}`);
  }

  if (limit < 2) return [];

  // We only need to mark multiples of p starting at p*p: smaller composites
  // (2p, 3p, ...) were already marked by smaller primes. p*p is also the
  // stopping condition for the outer loop — once p*p exceeds limit, every
  // remaining unmarked number is prime.
  const sieve = new Uint8Array(limit + 1).fill(1);
  sieve[0] = 0;
  sieve[1] = 0;

  const root = Math.floor(Math.sqrt(limit));
  for (let p = 2; p <= root; p++) {
    if (sieve[p] === 1) {
      const start = p * p;
      for (let multiple = start; multiple <= limit; multiple += p) {
        sieve[multiple] = 0;
      }
    }
  }

  const primes = [];
  for (let n = 2; n <= limit; n++) {
    if (sieve[n] === 1) primes.push(n);
  }
  return primes;
}

/**
 * Test whether `n` is prime.
 *
 * Implemented via trial division up to sqrt(n) rather than by sieving, so a
 * single primality check doesn't allocate O(n) memory. For repeated checks
 * across a dense range, call `sieveOfEratosthenes` once and look up instead.
 *
 * @param {number} n - The integer to test.
 * @returns {boolean} `true` if `n` is prime, `false` otherwise.
 * @throws {RangeError} If `n` is not a safe integer.
 */
export function isPrime(n) {
  if (!Number.isSafeInteger(n)) {
    throw new RangeError(`n must be a safe integer, got ${String(n)}`);
  }
  if (n < 2) return false;
  if (n < 4) return true;          // 2 and 3
  if (n % 2 === 0) return false;
  if (n % 3 === 0) return false;

  // After excluding 2 and 3, any prime is of the form 6k±1, so we step the
  // divisor by 6 and test both 6k-1 and 6k+1. This skips ~2/3 of composites
  // that naive +=2 iteration would still probe.
  for (let d = 5; d * d <= n; d += 6) {
    if (n % d === 0) return false;
    if (n % (d + 2) === 0) return false;
  }
  return true;
}

/**
 * Count the primes up to and including `limit` without materialising them.
 *
 * This is just `sieveOfEratosthenes(limit).length` expressed without the
 * array allocation. Kept because callers often only want the count and the
 * sieve result is large enough that the allocation is measurable.
 *
 * @param {number} limit - Non-negative integer upper bound (inclusive).
 * @returns {number} The count of primes <= limit.
 * @throws {RangeError} If `limit` is not a non-negative integer.
 */
export function primeCount(limit) {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new RangeError(`limit must be a non-negative integer, got ${String(limit)}`);
  }
  if (limit < 2) return 0;

  const sieve = new Uint8Array(limit + 1).fill(1);
  sieve[0] = 0;
  sieve[1] = 0;

  const root = Math.floor(Math.sqrt(limit));
  let count = 0;
  for (let p = 2; p <= root; p++) {
    if (sieve[p] === 1) {
      for (let m = p * p; m <= limit; m += p) sieve[m] = 0;
    }
  }
  // Single counting pass; no primes[] array ever built.
  for (let n = 2; n <= limit; n++) if (sieve[n] === 1) count++;
  return count;
}
