'use client';

import { Player } from '../../lib/types';
import { MAX_TIMEOUT_ROUNDS } from '../../lib/gameLogic';
import { usePlayerPanel } from './usePlayerPanel';

interface Props {
  player: Player;
  label: string;
  pieceCount: number;
  totalPieces: number;
  timeoutRounds: number;
  isCurrentPlayer: boolean;
  timer: number;
}

export default function PlayerPanel({
  player,
  label,
  pieceCount,
  totalPieces,
  timeoutRounds,
  isCurrentPlayer,
  timer,
}: Props) {
  const { color, timerPct, timerColor, avatar } = usePlayerPanel(player, timer);

  return (
    <div className="flex flex-col items-center gap-3 w-44">
      <div
        className={`w-full rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-300 ${
          isCurrentPlayer ? 'scale-105' : 'opacity-80'
        }`}
        style={{
          background: color.bg,
          border: `2px solid ${isCurrentPlayer ? color.accent : color.border}`,
          boxShadow: isCurrentPlayer
            ? `0 0 20px ${color.accent}44, 0 4px 16px rgba(0,0,0,0.15)`
            : '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
          style={{
            background: `linear-gradient(145deg, ${color.border}, ${color.accent}33)`,
            border: `2px solid ${color.border}`,
          }}
        >
          {avatar}
        </div>

        <div
          className="font-bold text-lg"
          style={{ color: color.accent }}
        >
          {label}
        </div>

        <div className="text-sm text-gray-600 font-medium">
          Remaining Pieces: {pieceCount}/{totalPieces}
        </div>
        <div className="text-sm text-gray-500">
          Timeout Rounds: {timeoutRounds}/{MAX_TIMEOUT_ROUNDS}
        </div>
      </div>

      {isCurrentPlayer && (
        <div
          className="w-full rounded-2xl p-3 flex flex-col items-center gap-2"
          style={{
            background: `linear-gradient(145deg, ${color.accent}, ${color.accent}cc)`,
            boxShadow: `0 4px 16px ${color.accent}55`,
          }}
        >
          <span className="text-white font-bold text-sm tracking-wide">
            {player === 'A' ? 'My Turn' : "Opponent's Turn"}
          </span>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${timerPct}%`,
                background: timerColor,
              }}
            />
          </div>
          <span className="text-white font-bold text-xl tabular-nums">{timer}</span>
        </div>
      )}
    </div>
  );
}
