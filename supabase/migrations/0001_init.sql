-- Phase 1: online matchmaking + realtime match state.
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create table if not exists public.queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  nickname text not null default 'Player',
  matched_match uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  player_a uuid not null,
  player_b uuid not null,
  board jsonb not null,
  current_player text not null default 'A' check (current_player in ('A', 'B')),
  remaining_turns int not null default 60,
  timeout_rounds jsonb not null default '{"A":0,"B":0}'::jsonb,
  turn_started_at timestamptz not null default now(),
  phase text not null default 'playing' check (phase in ('playing', 'gameover')),
  winner text check (winner in ('A', 'B', 'draw')),
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.queue enable row level security;
alter table public.matches enable row level security;

-- Players can only see/manage their own queue ticket.
create policy "select own queue row" on public.queue
  for select using (auth.uid() = user_id);
create policy "insert own queue row" on public.queue
  for insert with check (auth.uid() = user_id);
create policy "delete own queue row" on public.queue
  for delete using (auth.uid() = user_id);

-- Participants can read their match; all writes go through the game-move
-- Edge Function (service role), so there is no update/insert/delete policy here.
create policy "participants can select match" on public.matches
  for select using (auth.uid() = player_a or auth.uid() = player_b);

-- Builds one shuffled 16-tile board, mirroring app/lib/gameLogic.ts's initBoard().
-- Runs server-side only so no client can see the shuffle in advance.
create or replace function public.random_initial_board()
returns jsonb
language plpgsql
as $$
declare
  arr jsonb[] := array[]::jsonb[];
  i int;
  j int;
  tmp jsonb;
  tile_id int;
  tier int;
  owner text;
begin
  for tile_id in 0..15 loop
    tier := (tile_id % 8) + 1;
    owner := case when tile_id < 8 then 'A' else 'B' end;
    arr := arr || jsonb_build_object('id', tile_id, 'tier', tier, 'owner', owner, 'isRevealed', false);
  end loop;

  for i in reverse 16..2 loop
    j := 1 + floor(random() * i)::int;
    tmp := arr[i];
    arr[i] := arr[j];
    arr[j] := tmp;
  end loop;

  return to_jsonb(arr);
end;
$$;

-- Atomically pairs the caller with a waiting opponent, or enqueues them.
-- SKIP LOCKED means two concurrent callers can never grab the same ticket.
create or replace function public.find_or_create_match(p_nickname text)
returns table (match_id uuid, waiting boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_opponent record;
  v_match_id uuid;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  delete from public.queue where user_id = v_user;

  select * into v_opponent
  from public.queue
  where user_id <> v_user
  order by created_at asc
  for update skip locked
  limit 1;

  if found then
    insert into public.matches (player_a, player_b, board)
    values (v_opponent.user_id, v_user, public.random_initial_board())
    returning id into v_match_id;

    -- Signal the opponent (already subscribed to their own queue row via
    -- Realtime) that they've been matched. Each client deletes its own
    -- queue row once it has picked up the match id.
    update public.queue set matched_match = v_match_id where id = v_opponent.id;

    return query select v_match_id, false;
  else
    insert into public.queue (user_id, nickname) values (v_user, p_nickname);
    return query select null::uuid, true;
  end if;
end;
$$;
