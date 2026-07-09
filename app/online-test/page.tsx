'use client';

// Temporary Phase-1 test harness for online matchmaking + realtime sync.
// Not linked from the app's normal navigation — visit /online-test directly.
// Test with one normal window + one incognito/private window (or two
// different browsers): two tabs in the *same* browser share one anonymous
// session, so they'd both be "the same player".

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import OnlineGameScreen from '../components/OnlineGameScreen';

export default function OnlineTestPage() {
  const [nickname, setNickname] = useState('');
  const [status, setStatus] = useState<'idle' | 'signing-in' | 'searching' | 'matched'>('idle');
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'searching') return;

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) return;

      const channel = supabase
        .channel(`queue-${userId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'queue', filter: `user_id=eq.${userId}` },
          (payload) => {
            const matched = (payload.new as { matched_match: string | null }).matched_match;
            if (matched && !cancelled) {
              supabase.from('queue').delete().eq('user_id', userId).then();
              setMatchId(matched);
              setStatus('matched');
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const findMatch = async () => {
    setError(null);
    setStatus('signing-in');

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      const { error: signInErr } = await supabase.auth.signInAnonymously();
      if (signInErr) {
        setError(`${signInErr.message} (did you enable Anonymous Sign-ins in Supabase Auth settings?)`);
        setStatus('idle');
        return;
      }
    }

    const { data, error: rpcErr } = await supabase.rpc('find_or_create_match', {
      p_nickname: nickname || 'Player',
    });
    if (rpcErr) {
      setError(rpcErr.message);
      setStatus('idle');
      return;
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (row?.match_id) {
      setMatchId(row.match_id);
      setStatus('matched');
    } else {
      setStatus('searching');
    }
  };

  if (status === 'matched' && matchId) {
    return <OnlineGameScreen matchId={matchId} />;
  }

  return (
    <div className="bg-cosmic min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="font-display text-2xl font-extrabold text-white">Online Test Harness</h1>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
        className="w-64 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm"
        disabled={status !== 'idle'}
      />
      <button
        onClick={findMatch}
        disabled={status !== 'idle'}
        className="px-6 py-3 rounded-xl font-display font-bold text-white disabled:opacity-60"
        style={{ background: 'linear-gradient(90deg, #0891b2, #22d3ee)' }}
      >
        {status === 'idle' && 'Find Match'}
        {status === 'signing-in' && 'Signing in…'}
        {status === 'searching' && 'Waiting for opponent…'}
      </button>
      {error && <p className="text-red-400 text-sm font-semibold text-center max-w-md">{error}</p>}
    </div>
  );
}
