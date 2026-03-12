-- ================================================
-- Buildify — Supabase SQL Setup (Updated for V2)
-- Run this entire script in your Supabase SQL Editor
-- ================================================

-- 1. Projects table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  prompt text not null,
  style text not null,
  category text,
  html_content text not null,
  type text default 'static',
  slug text unique,
  is_public boolean default false,
  is_starred boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- In case the table already exists from an older version, add the new columns
alter table projects 
  add column if not exists type text default 'static',
  add column if not exists slug text unique,
  add column if not exists is_starred boolean default false;

-- Enable RLS
alter table projects enable row level security;

-- Policies for projects
create policy "Users can view own projects" on projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);
create policy "Public projects viewable by all" on projects for select using (is_public = true);


-- 2. Create project_versions table for history tracking
create table if not exists project_versions (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  html_content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for versions
alter table project_versions enable row level security;

create policy "Users can view own project versions"
  on project_versions for select
  using (
    exists (
      select 1 from projects 
      where projects.id = project_versions.project_id 
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can insert own project versions"
  on project_versions for insert
  with check (
    exists (
      select 1 from projects 
      where projects.id = project_versions.project_id 
      and projects.user_id = auth.uid()
    )
  );


-- 3. Templates (existing)
create table if not exists templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text not null,
  prompt text not null,
  style text not null,
  preview_url text,
  use_count integer default 0,
  created_at timestamp with time zone default now()
);

alter table templates enable row level security;
create policy "Templates viewable by all" on templates for select using (true);
