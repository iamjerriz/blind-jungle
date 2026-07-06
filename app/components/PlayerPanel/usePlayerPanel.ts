import { Player } from '../../lib/types';

export const PLAYER_COLORS: Record<Player, { accent: string; glow: string }> = {
  A: {
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.5)',
  },
  B: {
    accent: '#ef4444',
    glow: 'rgba(239,68,68,0.5)',
  },
};

export function usePlayerPanel(player: Player) {
  return { color: PLAYER_COLORS[player] };
}
