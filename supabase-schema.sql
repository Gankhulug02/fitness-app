-- Create workouts table
create table if not exists public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  emoji text default '💪',
  date date not null,
  sets jsonb not null default '[]'::jsonb,
  completed boolean default false,
  -- Recurrence metadata
  repeat_mode text default 'none' not null check (repeat_mode in ('none','everyday','weekdays')),
  repeat_weekdays jsonb not null default '[]'::jsonb,
  repeat_end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.workouts enable row level security;

-- Create policies
create policy "Users can view their own workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workouts"
  on public.workouts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own workouts"
  on public.workouts for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index workouts_user_id_date_idx on public.workouts(user_id, date desc);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger set_updated_at
  before update on public.workouts
  for each row
  execute function public.handle_updated_at();

-- Safe migration for existing databases
do $$
begin
  -- Add columns if they don't exist
  alter table public.workouts add column if not exists repeat_mode text default 'none' not null;
  alter table public.workouts add column if not exists repeat_weekdays jsonb not null default '[]'::jsonb;
  alter table public.workouts add column if not exists repeat_end_date date;
  -- Add check constraint if missing
  begin
    alter table public.workouts add constraint workouts_repeat_mode_check check (repeat_mode in ('none','everyday','weekdays'));
  exception when duplicate_object then null;
  end;
end $$;

