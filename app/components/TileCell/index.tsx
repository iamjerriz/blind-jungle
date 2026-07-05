'use client';

import { Tile } from '../../lib/types';
import { ANIMALS } from '../../lib/gameLogic';

interface Props {
  tile: Tile | null;
  isSelected: boolean;
  isValidTarget: boolean;
  onClick: () => void;
}

export default function TileCell({ tile, isSelected, isValidTarget, onClick }: Props) {
  if (tile === null) {
    return <div className='w-20 h-20 rounded-2xl bg-white/20 border-2 border-dashed border-white/30' onClick={onClick} />;
  }

  if (!tile.isRevealed) {
    return (
      <button
        onClick={onClick}
        className={`
          w-20 h-20 rounded-2xl flex items-center justify-center cursor-pointer
          transition-all duration-150 active:scale-95
          ${isValidTarget ? 'ring-4 ring-green-400 ring-offset-2' : ''}
          shadow-md hover:shadow-lg hover:-translate-y-0.5
        `}
        style={{
          background: 'linear-gradient(145deg, #f5c842, #d4960a)',
          boxShadow: isValidTarget ? '0 0 0 3px #4ade80, 0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        <div
          className='w-12 h-12 rounded-full flex items-center justify-center'
          style={{
            background: 'radial-gradient(circle at 40% 35%, #8b5cf6, #4c1d95)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <div className='w-3 h-3 rounded-full bg-white/40' />
        </div>
      </button>
    );
  }

  const animal = ANIMALS[tile.tier];
  const isPlayerA = tile.owner === 'A';

  return (
    <button
      onClick={onClick}
      className={`
        w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-0.5 cursor-pointer
        transition-all duration-150 active:scale-95 relative
        ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105' : ''}
        ${isValidTarget ? 'ring-4 ring-green-400 ring-offset-2' : ''}
        shadow-md hover:shadow-lg hover:-translate-y-0.5
      `}
      style={{
        background: isPlayerA ? 'linear-gradient(145deg, #ffd6d6, #ffb3b3)' : 'linear-gradient(145deg, #d6e8ff, #b3d1ff)',
        boxShadow: isSelected
          ? '0 0 0 3px #fbbf24, 0 4px 12px rgba(0,0,0,0.3)'
          : isValidTarget
            ? '0 0 0 3px #4ade80, 0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    >
      <span className='text-3xl leading-none'>{animal.emoji}</span>
      <div
        className='absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white'
        style={{
          background: isPlayerA ? '#ef4444' : '#3b82f6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      >
        {tile.tier}
      </div>
    </button>
  );
}
