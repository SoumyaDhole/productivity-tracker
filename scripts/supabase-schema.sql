-- Supabase schema setup for ProductivityTracker
-- Run this in Supabase SQL Editor for your project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  username text,
  full_name text,
  avatar_url text,
  level integer not null default 1,
  xp integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  title text not null,
  color text not null default '#7C3AED',
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  goal_id uuid references public.goals(id),
  title text not null,
  due_time text,
  priority text not null default 'Med' check (priority in ('High','Med','Low')),
  completed boolean not null default false,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  emoji text not null default '📝',
  color text not null default '#34D399',
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  completed_at date not null,
  unique(habit_id, completed_at)
);

create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.profiles (id, level, xp, created_at)
  values (new.id, 1, 0, now())
  on conflict (id) do nothing;

  insert into public.streaks (user_id, current_streak, longest_streak, updated_at)
  values (new.id, 0, 0, now())
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists handle_new_auth_user on auth.users;
create trigger handle_new_auth_user
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

-- Enable row level security and policies for each user-owned table.

alter table public.profiles enable row level security;
create policy "Profiles are visible to their owner" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles can be modified by their owner" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Profiles can be updated by their owner" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Profiles can be deleted by their owner" on public.profiles
  for delete using (auth.uid() = id);

alter table public.streaks enable row level security;
create policy "Streaks are visible to their owner" on public.streaks
  for select using (auth.uid() = user_id);
create policy "Streaks can be modified by their owner" on public.streaks
  for insert with check (auth.uid() = user_id);
create policy "Streaks can be updated by their owner" on public.streaks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Streaks can be deleted by their owner" on public.streaks
  for delete using (auth.uid() = user_id);

alter table public.goals enable row level security;
create policy "Goals are visible to their owner" on public.goals
  for select using (auth.uid() = user_id);
create policy "Goals can be modified by their owner" on public.goals
  for insert with check (auth.uid() = user_id);
create policy "Goals can be updated by their owner" on public.goals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Goals can be deleted by their owner" on public.goals
  for delete using (auth.uid() = user_id);

alter table public.tasks enable row level security;
create policy "Tasks are visible to their owner" on public.tasks
  for select using (auth.uid() = user_id);
create policy "Tasks can be inserted by their owner" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "Tasks can be updated by their owner" on public.tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Tasks can be deleted by their owner" on public.tasks
  for delete using (auth.uid() = user_id);

alter table public.habits enable row level security;
create policy "Habits are visible to their owner" on public.habits
  for select using (auth.uid() = user_id);
create policy "Habits can be inserted by their owner" on public.habits
  for insert with check (auth.uid() = user_id);
create policy "Habits can be updated by their owner" on public.habits
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Habits can be deleted by their owner" on public.habits
  for delete using (auth.uid() = user_id);

alter table public.habit_logs enable row level security;
create policy "Habit logs are visible to their owner" on public.habit_logs
  for select using (auth.uid() = user_id);
create policy "Habit logs can be inserted by their owner" on public.habit_logs
  for insert with check (auth.uid() = user_id);
create policy "Habit logs can be updated by their owner" on public.habit_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Habit logs can be deleted by their owner" on public.habit_logs
  for delete using (auth.uid() = user_id);
