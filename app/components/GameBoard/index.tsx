'use client';

import { Tile } from '../../lib/types';
import TileCell from '../TileCell';

interface Props {
  board: (Tile | null)[];
  selectedIndex: number | null;
  validTargets: number[];
  onTileClick: (index: number) => void;
  remainingTurns: number;
}

export default function GameBoard({ board, selectedIndex, validTargets, onTileClick, remainingTurns }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="px-6 py-2 rounded-full text-white font-bold text-lg"
        style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
      >
        Remaining Turns: {remainingTurns}
      </div>

      <div
        className="p-4 rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, #bfdbfe, #93c5fd)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.3), inset 0 2px 0 rgba(255,255,255,0.5)',
          border: '3px solid #60a5fa',
        }}
      >
        <div className="grid grid-cols-4 gap-3">
          {board.map((tile, i) => (
            <TileCell
              key={i}
              tile={tile}
              isSelected={selectedIndex === i}
              isValidTarget={validTargets.includes(i)}
              onClick={() => onTileClick(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
