-- Storage for the divination types ported from chatgpt-tarot-divination
-- (BaZi, name numerology, auspicious naming, I Ching, love compatibility).
-- Run this once in the Supabase SQL editor.

create table if not exists public.divinations (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  input jsonb not null default '{}'::jsonb,
  chart jsonb,
  content text not null,
  date date not null,
  created_at timestamptz not null default now()
);

create index if not exists divinations_user_created_idx
  on public.divinations (user_id, created_at desc);

create index if not exists divinations_user_type_idx
  on public.divinations (user_id, type);

alter table public.divinations enable row level security;

-- Readings are written by the service role from the server action; users may
-- only read their own.
drop policy if exists "divinations_select_own" on public.divinations;
create policy "divinations_select_own"
  on public.divinations for select
  using (auth.uid() = user_id);

-- The transactions table records spends as SPEND_DIVINATION; no schema change
-- is needed there as long as `type` is a text column.
