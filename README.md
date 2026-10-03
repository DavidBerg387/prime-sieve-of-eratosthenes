# prime-sieve-eratosthenes

A tiny, dependency-free TypeScript library that generates all prime numbers up to a given inclusive limit using the classical Sieve of Eratosthenes.

## Usage

```js
import { sieveOfEratosthenes, isPrime, primeCount } from './src/index.js';

const primes = sieveOfEratosthenes(30);  // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
isPrime(17);                             // true
primeCount(100);                          // 25
```

`limit` is **inclusive**: `sieveOfEratosthenes(13)` includes `13`.

## Why

This exists for the common, narrow case of needing all primes up to a moderate bound in one shot. The sieve uses a single `Uint8Array` over a flat boolean table, which keeps the hot marking loop cache-friendly; bit-packing was rejected because it would roughly halve throughput for the small-to-mid sizes that dominate actual usage. `isPrime` is trial division (6k±1) rather than a sieve lookup, so a one-off check does not pay the O(n) allocation cost of building a full table.

## Edge cases

- `limit < 2` returns an empty array (or `0` for `primeCount`).
- `isPrime` rejects non-safe-integers, including fractional values and values above `Number.MAX_SAFE_INTEGER`, because primality testing of arbitrary-precision integers is out of scope.
- Both functions reject non-integer and negative inputs with a `RangeError`.
