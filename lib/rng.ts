/**
 * A small seeded generator (mulberry32).
 *
 * The scenes need scatter, but `Math.random()` is impure: it makes a render
 * non-deterministic, which React's compiler rejects and which would let the
 * server and the client disagree. A seed gives the same scatter every time,
 * and makes a scene reproducible when one needs tuning.
 */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
