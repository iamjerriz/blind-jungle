'use client';

import { Tile } from '../../lib/types';
import TileCell from '../TileCell';

interface Props {
  board: (Tile | null)[];
  selectedIndex: number | null;
  validTargets: number[];
  onTileClick: (index: number) => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';

function getDirection(from: number, to: number): Direction {
  const fromRow = Math.floor(from / 4);
  const fromCol = from % 4;
  const toRow = Math.floor(to / 4);
  const toCol = to % 4;
  if (toRow < fromRow) return 'up';
  if (toRow > fromRow) return 'down';
  return toCol < fromCol ? 'left' : 'right';
}

export default function GameBoard({ board, selectedIndex, validTargets, onTileClick }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="p-4 rounded-3xl border"
        style={{
          background: 'linear-gradient(160deg, #0a1120, #050810)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="grid grid-cols-4 gap-2.5">
          {board.map((tile, i) => (
            <TileCell
              key={i}
              tile={tile}
              isSelected={selectedIndex === i}
              isValidTarget={validTargets.includes(i)}
              incomingDirection={
                selectedIndex !== null && validTargets.includes(i) ? getDirection(selectedIndex, i) : null
              }
              onClick={() => onTileClick(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
