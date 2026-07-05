'use client';

import { ANIMAL_GIFS } from '../../lib/animalAssets';
import { TIERS } from './constants';

export default function PieceQueue() {
  return (
    <div className='flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50'>
      {TIERS.map((tier) => (
        <div key={tier} className='flex flex-col items-center gap-0.5'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden' style={{ background: 'linear-gradient(145deg, #fff, #f0f0f0)' }}>
            <img src={ANIMAL_GIFS[tier]} alt='' className='w-full h-full object-contain' draggable={false} />
          </div>
          <span className='text-xs font-bold text-gray-600'>{tier}</span>
        </div>
      ))}
      <div className='ml-2 border-l border-gray-300 pl-2 text-xs text-gray-500 leading-tight'>
        <div>Mouse Beats Elephant</div>
      </div>
    </div>
  );
}
