'use client';

import { Tile } from '../../lib/types';
import { ANIMAL_GIFS } from '../../lib/animalAssets';

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
          w-20 h-20 rounded-2xl cursor-pointer overflow-hidden
          transition-all duration-150 active:scale-95
          ${isValidTarget ? 'ring-4 ring-green-400 ring-offset-2' : ''}
          shadow-md hover:shadow-lg hover:-translate-y-0.5
        `}
        style={{
          background: '#ffffff',
          boxShadow: isValidTarget
            ? '0 0 0 3px #4ade80, 0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        <img
          src="/agave.gif"
          alt=""
          className="w-full h-full object-contain"
          style={{ mixBlendMode: 'multiply' }}
          draggable={false}
        />
      </button>
    );
  }

  const isPlayerA = tile.owner === 'A';
  const badgeColor = isPlayerA ? '#ef4444' : '#3b82f6';

  return (
    <button
      onClick={onClick}
      className={`
        w-20 h-20 rounded-2xl cursor-pointer
        transition-all duration-150 active:scale-95 relative overflow-hidden
        ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105' : ''}
        ${isValidTarget ? 'ring-4 ring-green-400 ring-offset-2' : ''}
        shadow-md hover:shadow-lg hover:-translate-y-0.5
      `}
      style={{
        background: '#ffffff',
        boxShadow: isSelected
          ? '0 0 0 3px #fbbf24, 0 4px 12px rgba(0,0,0,0.3)'
          : isValidTarget
            ? '0 0 0 3px #4ade80, 0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    >
      <img
        src={ANIMAL_GIFS[tile.tier]}
        alt=""
        className="w-full h-full object-contain"
        draggable={false}
      />
      <div
        className='absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white'
        style={{
          background: badgeColor,
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      >
        {tile.tier}
      </div>
    </button>
  );
}
