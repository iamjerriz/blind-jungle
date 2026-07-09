// Single entry point for all match mutations (flip / move / timeout).
// Clients never write to the `matches` table directly — they call this
// function, which validates the action against the same rules as local
// play and writes the result with the service-role key.
//
// Deploy with: npx supabase functions deploy game-move

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { applyAction, MatchAction, MatchState } from '../_shared/applyAction.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  let matchId: string;
  let action: MatchAction;
  try {
    const body = await req.json();
    matchId = body.matchId;
    action = body.action;
    if (!matchId || !action?.type) throw new Error('missing matchId/action');
  } catch {
    return json({ error: 'invalid request body' }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Verify who's calling using their own JWT (from the Authorization header
  // supabase-js sends automatically with functions.invoke).
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const {
    data: { user },
    error: userErr,
  } = await userClient.auth.getUser();
  if (userErr || !user) return json({ error: 'unauthorized' }, 401);

  // Service-role client bypasses RLS for the actual read/write.
  const admin = createClient(supabaseUrl, serviceRoleKey);

  const { data: match, error: matchErr } = await admin.from('matches').select('*').eq('id', matchId).single();
  if (matchErr || !match) return json({ error: 'match not found' }, 404);

  const isA = match.player_a === user.id;
  const isB = match.player_b === user.id;
  if (!isA && !isB) return json({ error: 'not a participant in this match' }, 403);

  const callerRole = isA ? 'A' : 'B';
  if (action.type !== 'timeout' && callerRole !== match.current_player) {
    return json({ error: 'not your turn' }, 409);
  }

  const currentState: MatchState = {
    board: match.board,
    current_player: match.current_player,
    remaining_turns: match.remaining_turns,
    timeout_rounds: match.timeout_rounds,
    phase: match.phase,
    winner: match.winner,
  };

  let result;
  try {
    result = applyAction(currentState, action);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'invalid action' }, 400);
  }

  const { error: updateErr } = await admin
    .from('matches')
    .update({
      board: result.match.board,
      current_player: result.match.current_player,
      remaining_turns: result.match.remaining_turns,
      timeout_rounds: result.match.timeout_rounds,
      phase: result.match.phase,
      winner: result.match.winner,
      last_message: result.message,
      last_message_at: result.message ? new Date().toISOString() : null,
      turn_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', matchId);

  if (updateErr) return json({ error: updateErr.message }, 500);

  return json({ ok: true, message: result.message });
});
