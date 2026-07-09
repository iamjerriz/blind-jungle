// Ported from the handleTileClick/endTurn logic in
// app/components/GameScreen/useGameScreen.ts, refactored into a pure
// function so it can run server-side against a matches row.

import { ANIMALS, MAX_TIMEOUT_ROUNDS, Player, Tile, canCapture, countPieces, getValidMoveTargets } from './gameLogic.ts';

export interface MatchState {
  board: (Tile | null)[];
  current_player: Player;
  remaining_turns: number;
  timeout_rounds: { A: number; B: number };
  phase: 'playing' | 'gameover';
  winner: Player | 'draw' | null;
}

export type MatchAction =
  | { type: 'flip'; index: number }
  | { type: 'move'; from: number; to: number }
  | { type: 'timeout' };

export function applyAction(match: MatchState, action: MatchAction): { match: MatchState; message: string | null } {
  if (match.phase === 'gameover') {
    throw new Error('Game is already over');
  }

  const board = [...match.board];
  let message: string | null = null;
  let timedOut = false;

  if (action.type === 'timeout') {
    timedOut = true;
  } else if (action.type === 'flip') {
    const tile = board[action.index];
    if (!tile || tile.isRevealed) throw new Error('Invalid flip');
    board[action.index] = { ...tile, isRevealed: true };
  } else if (action.type === 'move') {
    const moving = board[action.from];
    if (!moving || !moving.isRevealed || moving.owner !== match.current_player) {
      throw new Error('Invalid piece selected');
    }
    const targets = getValidMoveTargets(board, action.from, match.current_player);
    if (!targets.includes(action.to)) throw new Error('Invalid move target');

    const target = board[action.to];
    if (target === null) {
      board[action.to] = moving;
      board[action.from] = null;
    } else if (target.isRevealed && target.owner !== match.current_player) {
      if (moving.tier === target.tier) {
        board[action.to] = null;
        board[action.from] = null;
        message = `Both ${ANIMALS[moving.tier].name}s eliminated!`;
      } else if (canCapture(moving.tier, target.tier)) {
        board[action.to] = moving;
        board[action.from] = null;
        message = `${ANIMALS[moving.tier].name} captures ${ANIMALS[target.tier].name}!`;
      } else {
        throw new Error('Illegal capture');
      }
    } else {
      throw new Error('Invalid move target');
    }
  }

  const piecesA = countPieces(board, 'A');
  const piecesB = countPieces(board, 'B');

  if (piecesA === 0) return { match: { ...match, board, phase: 'gameover', winner: 'B' }, message };
  if (piecesB === 0) return { match: { ...match, board, phase: 'gameover', winner: 'A' }, message };

  const newRemaining = match.remaining_turns - 1;
  if (newRemaining <= 0) {
    const winner = piecesA > piecesB ? 'A' : piecesB > piecesA ? 'B' : 'draw';
    return { match: { ...match, board, phase: 'gameover', winner, remaining_turns: 0 }, message };
  }

  const newTimeouts = timedOut
    ? { ...match.timeout_rounds, [match.current_player]: match.timeout_rounds[match.current_player] + 1 }
    : match.timeout_rounds;

  const nextPlayer: Player = match.current_player === 'A' ? 'B' : 'A';

  if (newTimeouts[match.current_player] >= MAX_TIMEOUT_ROUNDS) {
    return { match: { ...match, board, phase: 'gameover', winner: nextPlayer }, message };
  }

  return {
    match: {
      ...match,
      board,
      current_player: nextPlayer,
      remaining_turns: newRemaining,
      timeout_rounds: newTimeouts,
    },
    message,
  };
}
