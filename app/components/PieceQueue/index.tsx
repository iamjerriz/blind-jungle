'use client';

import { ANIMALS } from '../../lib/gameLogic';
import { TIERS } from './constants';

export default function PieceQueue() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50">
      {TIERS.map((tier) => {
        const animal = ANIMALS[tier];
        return (
          <div key={tier} className="flex flex-col items-center gap-0.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
              style={{ background: 'linear-gradient(145deg, #fff, #f0f0f0)' }}
            >
              {animal.emoji}
            </div>
            <span className="text-xs font-bold text-gray-600">{tier}</span>
          </div>
        );
      })}
      <div className="ml-2 border-l border-gray-300 pl-2 text-xs text-gray-500 leading-tight">
        <div>1 (Mouse)</div>
        <div className="font-bold text-purple-600">beats 8</div>
      </div>
    </div>
  );
}
