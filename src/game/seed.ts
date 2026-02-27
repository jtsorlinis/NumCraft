export type RNG = () => number;

export const hashStringToSeed = (input: string): number => {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
};

export const mulberry32 = (seed: number): RNG => {
  let t = seed >>> 0;

  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const createSeededRng = (seedInput: string): RNG => {
  return mulberry32(hashStringToSeed(seedInput));
};

export const randomInt = (rng: RNG, min: number, max: number): number => {
  if (max < min) {
    throw new Error(`Invalid range: min=${min}, max=${max}`);
  }

  const span = max - min + 1;
  return Math.floor(rng() * span) + min;
};
