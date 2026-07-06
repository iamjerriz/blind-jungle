import { AnimalTier, Player } from './types';

const ANIMAL_KEYS: Record<AnimalTier, string> = {
  1: 'mouse',
  2: 'cat',
  3: 'bunny',
  4: 'pig',
  5: 'wolf',
  6: 'tiger',
  7: 'lion',
  8: 'elephant',
};

// These two only have a blue-platform cutout so far; fall back to it for both owners.
const BLUE_ONLY: ReadonlySet<AnimalTier> = new Set([4, 5]);

export function getAnimalImage(tier: AnimalTier, owner: Player): string {
  const key = ANIMAL_KEYS[tier];
  const variant = owner === 'A' && !BLUE_ONLY.has(tier) ? 'red' : 'blue';
  return `/animals/${key}${variant}.webp`;
}
