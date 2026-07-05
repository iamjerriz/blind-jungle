export type AnimalTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Player = 'A' | 'B';
export type GamePhase = 'playing' | 'gameover';

export interface Tile {
  id: number;
  tier: AnimalTier;
  owner: Player;
  isRevealed: boolean;
}
