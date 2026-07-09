import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { getValidMoveTargets } from '../../lib/gameLogic';
import { Player, Tile } from '../../lib/types';

interface MatchRow {
  id: string;
  player_a: string;
  player_b: string;
  board: (Tile | null)[];
  current_player: Player;
  remaining_turns: number;
  timeout_rounds: { A: number; B: number };
  phase: 'playing' | 'gameover';
  winner: Player | 'draw' | null;
  last_message: string | null;
  last_message_at: string | null;
  turn_started_at: string;
}

// Two tabs in the *same* browser share one anonymous session (same
// localStorage) — test with one normal + one incognito/private window
// (or two different browsers) so each gets its own identity.
async function ensureAnonymousSession(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user.id;

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error || !signInData.session) {
    throw new Error(error?.message ?? 'Failed to start an anonymous session');
  }
  return signInData.session.user.id;
}

export function useOnlineGameScreen(matchId: string) {
  const [userId, setUserId] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchRow | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    ensureAnonymousSession()
      .then((id) => {
        if (!cancelled) setUserId(id);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()
      .then(({ data, error: fetchErr }) => {
        if (cancelled) return;
        if (fetchErr) setError(fetchErr.message);
        else setMatch(data as MatchRow);
      });

    const flashMessage = (row: MatchRow) => {
      if (!row.last_message || !row.last_message_at) return;
      setMessage(row.last_message);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => setMessage(null), 1500);
    };

    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` },
        (payload) => {
          const row = payload.new as MatchRow;
          setMatch(row);
          flashMessage(row);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [userId, matchId]);

  const myRole: Player | null = !match || !userId ? null : match.player_a === userId ? 'A' : match.player_b === userId ? 'B' : null;

  const validTargets = useMemo(() => {
    if (!match || selectedIndex === null || !myRole) return [];
    return getValidMoveTargets(match.board, selectedIndex, myRole);
  }, [match, selectedIndex, myRole]);

  const sendAction = useCallback(
    async (action: { type: 'flip'; index: number } | { type: 'move'; from: number; to: number }) => {
      const { error: invokeErr } = await supabase.functions.invoke('game-move', {
        body: { matchId, action },
      });
      if (invokeErr) setError(invokeErr.message);
    },
    [matchId]
  );

  const handleTileClick = useCallback(
    (index: number) => {
      if (!match || match.phase === 'gameover' || myRole !== match.current_player) return;
      const tile = match.board[index];

      if (selectedIndex !== null) {
        if (index === selectedIndex) {
          setSelectedIndex(null);
          return;
        }
        sendAction({ type: 'move', from: selectedIndex, to: index });
        setSelectedIndex(null);
        return;
      }

      if (!tile) return;
      if (!tile.isRevealed) {
        sendAction({ type: 'flip', index });
        return;
      }
      if (tile.owner === myRole) setSelectedIndex(index);
    },
    [match, myRole, selectedIndex, sendAction]
  );

  return { match, myRole, selectedIndex, validTargets, message, error, handleTileClick };
}
