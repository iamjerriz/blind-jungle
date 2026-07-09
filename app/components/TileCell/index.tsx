'use client';

import { Tile } from '../../lib/types';
import { getAnimalImage } from '../../lib/animalAssets';

type Direction = 'up' | 'down' | 'left' | 'right';

interface Props {
  tile: Tile | null;
  isSelected: boolean;
  isValidTarget: boolean;
  incomingDirection?: Direction | null;
  onClick: () => void;
}

const ARROW_GLYPH: Record<Direction, string> = {
  up: '▲',
  down: '▼',
  left: '◀',
  right: '▶',
};

const ARROW_ANIM: Record<Direction, string> = {
  up: 'animate-arrow-up',
  down: 'animate-arrow-down',
  left: 'animate-arrow-left',
  right: 'animate-arrow-right',
};

const ARROW_POSITION: Record<Direction, string> = {
  up: 'top-1 left-1/2 -translate-x-1/2',
  down: 'bottom-1 left-1/2 -translate-x-1/2',
  left: 'left-1 top-1/2 -translate-y-1/2',
  right: 'right-1 top-1/2 -translate-y-1/2',
};

const SIZE_CLASSES = 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32';

export default function TileCell({ tile, isSelected, isValidTarget, incomingDirection, onClick }: Props) {
  if (tile === null) {
    return (
      <button
        onClick={onClick}
        className={`${SIZE_CLASSES} rounded-xl border border-dashed border-white/10`}
        style={{ background: 'rgba(255,255,255,0.02)' }}
      />
    );
  }

  if (!tile.isRevealed) {
    return (
      <button
        onClick={onClick}
        className={`
          ${SIZE_CLASSES} rounded-xl relative cursor-pointer overflow-hidden
          transition-all duration-150 active:scale-95 hover:-translate-y-0.5
          ${isValidTarget ? 'ring-2 ring-cyan-400 animate-glow-pulse-cyan' : ''}
        `}
        style={{ background: '#0e1730', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="absolute inset-2 rounded-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 35% 28%, #fde68a, #d97706 75%)',
            boxShadow: 'inset 0 3px 5px rgba(255,255,255,0.55), inset 0 -4px 8px rgba(120,53,15,0.55), 0 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3.5 sm:h-4 md:h-5 flex items-center justify-center gap-1"
            style={{ background: 'linear-gradient(90deg, #6d28d9, #a78bfa, #6d28d9)', boxShadow: '0 0 4px rgba(0,0,0,0.3)' }}
          >
            <span className="w-1 h-1 rounded-full bg-white/80" />
            <span className="w-1 h-1 rounded-full bg-white/80" />
            <span className="w-1 h-1 rounded-full bg-white/80" />
          </div>
        </div>
      </button>
    );
  }

  const badgeColor = tile.owner === 'A' ? '#22d3ee' : '#ef4444';

  return (
    <button
      onClick={onClick}
      className={`
        ${SIZE_CLASSES} rounded-xl cursor-pointer
        transition-all duration-150 active:scale-95 relative overflow-visible
        ${isSelected ? 'ring-2 ring-cyan-300 scale-105' : ''}
        ${isValidTarget ? 'ring-2 ring-cyan-400 animate-glow-pulse-cyan' : ''}
        hover:-translate-y-0.5
      `}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `2px solid ${badgeColor}40`,
      }}
    >
      {incomingDirection && (
        <span
          className={`absolute z-10 text-cyan-300 text-base sm:text-lg drop-shadow-[0_0_4px_rgba(34,211,238,0.9)] ${ARROW_POSITION[incomingDirection]} ${ARROW_ANIM[incomingDirection]}`}
        >
          {ARROW_GLYPH[incomingDirection]}
        </span>
      )}
      <img
        src={getAnimalImage(tile.tier, tile.owner)}
        alt=""
        className="w-full h-full object-contain animate-piece-bob"
        style={{
          animationDelay: `${(tile.id % 8) * 0.15}s`,
          filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.45))',
        }}
        draggable={false}
      />
      <div
        className="absolute top-1 right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white border border-white/40"
        style={{
          background: badgeColor,
          boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}
      >
        {tile.tier}
      </div>
    </button>
  );
}
