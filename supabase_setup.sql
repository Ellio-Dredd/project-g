-- ==========================================================================
-- GIMHANI'S PIXEL QUEST - SUPABASE DATABASE CONFIGURATION
-- Run this script in your Supabase SQL Editor to initialize all tables!
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. Create the 'responses' table to log final calendar picks
-- --------------------------------------------------------------------------
create table if not exists public.responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  single_status text,
  movie_picked text,
  date_picked date,
  user_agent text
);

-- Enable RLS and create public policies for responses table
alter table public.responses enable row level security;

drop policy if exists "Allow public anonymous inserts" on public.responses;
create policy "Allow public anonymous inserts" on public.responses 
  for insert with check (true);

drop policy if exists "Allow public anonymous reads" on public.responses;
create policy "Allow public anonymous reads" on public.responses 
  for select using (true);

-- --------------------------------------------------------------------------
-- 2. Create the 'visits' table to track initial click counts and locations
-- --------------------------------------------------------------------------
create table if not exists public.visits (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address text,
  city text,
  region text,
  country text,
  org text,
  user_agent text,
  screen_size text,
  local_time text
);

-- Enable RLS and create public policies for visits table
alter table public.visits enable row level security;

drop policy if exists "Allow public visits inserts" on public.visits;
create policy "Allow public visits inserts" on public.visits 
  for insert with check (true);

drop policy if exists "Allow public visits reads" on public.visits;
create policy "Allow public visits reads" on public.visits 
  for select using (true);
