'use client';

import GameBoard from '../GameBoard';
import PlayerPanel from '../PlayerPanel';
import { useOnlineGameScreen } from './useOnlineGameScreen';
import { countPieces } from '../../lib/gameLogic';

interface Props {
  matchId: string;
}

export default function OnlineGameScreen({ matchId }: Props) {
  const { match, myRole, selectedIndex, validTargets, message, error, handleTileClick } = useOnlineGameScreen(matchId);

  if (error) {
    return (
      <div className="bg-cosmic min-h-screen flex items-center justify-center p-6 text-red-400 font-semibold text-center">
        {error}
      </div>
    );
  }

  if (!match) {
    return (
      <div className="bg-cosmic min-h-screen flex items-center justify-center p-6 text-slate-400 font-semibold">
        Loading match…
      </div>
    );
  }

  const piecesA = countPieces(match.board, 'A');
  const piecesB = countPieces(match.board, 'B');

  return (
    <div className="bg-cosmic min-h-screen flex flex-col items-center gap-4 p-3 sm:p-5 relative overflow-hidden">
      <div className="text-xs text-slate-500 font-semibold z-10">
        You are <span className="text-cyan-300 font-bold">Player {myRole ?? '?'}</span> · match {matchId.slice(0, 8)}
      </div>

      <div className="w-full max-w-3xl flex items-stretch justify-between gap-2 sm:gap-3 z-10">
        <PlayerPanel player="A" label="Player A" pieceCount={piecesA} totalPieces={8} timeoutRounds={match.timeout_rounds.A} isCurrentPlayer={match.current_player === 'A'} />
        <div className="shrink-0 self-center px-4 py-2 rounded-2xl font-display font-extrabold text-lg border-2 border-cyan-400 text-cyan-300">
          {match.remaining_turns} turns left
        </div>
        <PlayerPanel player="B" label="Player B" pieceCount={piecesB} totalPieces={8} timeoutRounds={match.timeout_rounds.B} isCurrentPlayer={match.current_player === 'B'} />
      </div>

      <GameBoard board={match.board} selectedIndex={selectedIndex} validTargets={validTargets} onTileClick={handleTileClick} />

      <div
        className="w-full max-w-3xl rounded-2xl px-4 py-3 text-center z-10 border"
        style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <span className="text-sm font-semibold text-amber-300">
          {message ??
            (match.phase === 'gameover'
              ? match.winner === 'draw'
                ? "It's a draw!"
                : `Player ${match.winner} wins!`
              : `${match.current_player === myRole ? 'Your' : "Opponent's"} turn`)}
        </span>
      </div>
    </div>
  );
}
