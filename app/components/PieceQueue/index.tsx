'use client';

import { getAnimalImage } from '../../lib/animalAssets';
import { TIERS } from './constants';

export default function PieceQueue() {
  const strongestFirst = [...TIERS].reverse();

  return (
    <div
      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-2xl border overflow-x-auto max-w-full"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      <span className="font-display text-[11px] font-bold text-cyan-300/80 tracking-widest whitespace-nowrap">
        LEGEND
      </span>
      {strongestFirst.map((tier, i) => (
        <div key={tier} className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex flex-col items-center gap-0.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden border border-white/10"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <img src={getAnimalImage(tier, 'A')} alt="" className="w-full h-full object-contain" draggable={false} />
            </div>
            <span className="text-[9px] font-bold text-slate-400">Tier {tier}</span>
          </div>
          {i < strongestFirst.length - 1 && <span className="text-slate-600 text-xs">›</span>}
        </div>
      ))}
      <div className="ml-1 pl-3 border-l border-white/10 text-[10px] text-amber-300/70 leading-tight whitespace-nowrap font-semibold">
        🐭 Mouse beats 🐘 Elephant
      </div>
    </div>
  );
}
