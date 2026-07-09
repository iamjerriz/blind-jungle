// Ported from app/lib/gameLogic.ts. Deno Edge Functions can't import across
// the supabase/ boundary into app/, so this is a deliberate copy — keep the
// two in sync if the rules ever change.

export type AnimalTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Player = 'A' | 'B';

export interface Tile {
  id: number;
  tier: AnimalTier;
  owner: Player;
  isRevealed: boolean;
}

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

export function canCapture(attackerTier: AnimalTier, defenderTier: AnimalTier): boolean {
  if (attackerTier === 1 && defenderTier === 8) return true;
  if (attackerTier === 8 && defenderTier === 1) return false;
  return attackerTier >= defenderTier;
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
