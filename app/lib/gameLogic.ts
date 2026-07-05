import { AnimalTier, Player, Tile } from './types';

export const ANIMALS: Record<AnimalTier, { name: string; emoji: string }> = {
  1: { name: 'Mouse', emoji: '🐭' },
  2: { name: 'Cat', emoji: '🐱' },
  3: { name: 'Dog', emoji: '🐕' },
  4: { name: 'Wolf', emoji: '🐺' },
  5: { name: 'Leopard', emoji: '🐆' },
  6: { name: 'Tiger', emoji: '🐯' },
  7: { name: 'Lion', emoji: '🦁' },
  8: { name: 'Elephant', emoji: '🐘' },
};

export const TURN_TIME = 15;
export const MAX_TIMEOUT_ROUNDS = 3;
export const INITIAL_TURNS = 60;

export function canCapture(attackerTier: AnimalTier, defenderTier: AnimalTier): boolean {
  if (attackerTier === 1 && defenderTier === 8) return true;
  if (attackerTier === 8 && defenderTier === 1) return false;
  return attackerTier >= defenderTier;
}

export function initBoard(): (Tile | null)[] {
  const tiers: AnimalTier[] = [1, 2, 3, 4, 5, 6, 7, 8];

  const allTiles: Tile[] = [
    ...tiers.map((tier, i) => ({ id: i, tier, owner: 'A' as Player, isRevealed: false })),
    ...tiers.map((tier, i) => ({ id: i + 8, tier, owner: 'B' as Player, isRevealed: false })),
  ];

  for (let i = allTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTiles[i], allTiles[j]] = [allTiles[j], allTiles[i]];
  }

  return allTiles;
}

export function getAdjacentIndices(index: number): number[] {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const adj: number[] = [];
  if (row > 0) adj.push(index - 4);
  if (row < 3) adj.push(index + 4);
  if (col > 0) adj.push(index - 1);
  if (col < 3) adj.push(index + 1);
  return adj;
}

export function getValidMoveTargets(
  board: (Tile | null)[],
  fromIndex: number,
  currentPlayer: Player
): number[] {
  const piece = board[fromIndex];
  if (!piece || !piece.isRevealed || piece.owner !== currentPlayer) return [];

  return getAdjacentIndices(fromIndex).filter((i) => {
    const target = board[i];
    if (target === null) return true;
    if (!target.isRevealed) return false;
    if (target.owner === currentPlayer) return false;
    return canCapture(piece.tier, target.tier);
  });
}

export function countPieces(board: (Tile | null)[], player: Player): number {
  return board.filter((t) => t !== null && t.owner === player).length;
}
