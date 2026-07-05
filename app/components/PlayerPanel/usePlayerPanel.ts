import { Player } from '../../lib/types';
import { TURN_TIME } from '../../lib/gameLogic';

export const AVATARS: Record<Player, string> = {
  A: '🧑‍🎮',
  B: '🧝',
};

export const PLAYER_COLORS: Record<Player, { bg: string; accent: string; border: string }> = {
  A: {
    bg: 'linear-gradient(145deg, #fff0f0, #ffe4e4)',
    accent: '#ef4444',
    border: '#fca5a5',
  },
  B: {
    bg: 'linear-gradient(145deg, #f0f4ff, #e4eeff)',
    accent: '#3b82f6',
    border: '#93c5fd',
  },
};

export function usePlayerPanel(player: Player, timer: number) {
  const color = PLAYER_COLORS[player];
  const timerPct = (timer / TURN_TIME) * 100;
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444';

  return { color, timerPct, timerColor, avatar: AVATARS[player] };
}
