import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../src/game/seed';

describe('seeded RNG', () => {
  it('is deterministic for the same seed', () => {
    const rngA = createSeededRng('numcraft|2026-02-01|v1');
    const rngB = createSeededRng('numcraft|2026-02-01|v1');

    const sequenceA = [rngA(), rngA(), rngA(), rngA(), rngA()];
    const sequenceB = [rngB(), rngB(), rngB(), rngB(), rngB()];

    expect(sequenceA).toEqual(sequenceB);
  });

  it('changes with a different seed', () => {
    const rngA = createSeededRng('numcraft|2026-02-01|v1');
    const rngB = createSeededRng('numcraft|2026-02-02|v1');

    const sequenceA = [rngA(), rngA(), rngA()];
    const sequenceB = [rngB(), rngB(), rngB()];

    expect(sequenceA).not.toEqual(sequenceB);
  });
});
