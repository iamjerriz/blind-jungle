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
}

export default function PlayerPanel({
  player,
  label,
  pieceCount,
  totalPieces,
  timeoutRounds,
  isCurrentPlayer,
}: Props) {
  const { color } = usePlayerPanel(player);
  const suffix = player === 'A' ? 'You' : 'Foe';
  const isRight = player === 'B';

  return (
    <div
      className={`flex-1 min-w-0 px-4 py-2.5 sm:px-5 sm:py-3 transition-all duration-300 ${
        isCurrentPlayer ? 'scale-105' : 'opacity-55'
      } ${isRight ? 'text-right' : 'text-left'}`}
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        border: `2px solid ${color.accent}`,
        borderRadius: '1rem',
        clipPath: isRight
          ? 'polygon(6% 0, 100% 0, 100% 100%, 6% 100%, 0 50%)'
          : 'polygon(0 0, 94% 0, 100% 50%, 94% 100%, 0 100%)',
        boxShadow: isCurrentPlayer ? `0 0 22px ${color.glow}, 0 4px 14px rgba(0,0,0,0.4)` : 'none',
      }}
    >
      <div className="font-display font-extrabold text-xs sm:text-sm tracking-wide truncate" style={{ color: color.accent }}>
        {label.toUpperCase()} PLAYER <span className="text-slate-400 font-semibold">({suffix})</span>
      </div>
      <div className="text-[11px] sm:text-xs text-slate-300 font-semibold">
        Score: {pieceCount}/{totalPieces}
      </div>
      <div className="text-[10px] text-slate-500">
        Timeouts: {timeoutRounds}/{MAX_TIMEOUT_ROUNDS}
      </div>
    </div>
  );
}
