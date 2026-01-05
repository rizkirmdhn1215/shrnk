-- Create short_links table
create table if not exists public.short_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_url text not null,
  short_slug text not null,
  custom_slug text,
  expires_at timestamp with time zone,
  password_hash text,
  password_enabled boolean default false,
  qr_code_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(short_slug)
);

-- Create analytics table
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.short_links(id) on delete cascade,
  click_timestamp timestamp with time zone default now(),
  ip_address text,
  country text,
  city text,
  device_type text,
  browser text,
  referrer text
);

-- Enable RLS
alter table public.short_links enable row level security;
alter table public.analytics enable row level security;

-- RLS Policies for short_links
create policy "Users can view their own links"
  on public.short_links for select
  using (auth.uid() = user_id);

create policy "Users can create their own links"
  on public.short_links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on public.short_links for update
  using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on public.short_links for delete
  using (auth.uid() = user_id);

-- RLS Policies for analytics (allow public reads for tracking, user can view their own link analytics)
create policy "Users can view analytics for their links"
  on public.analytics for select
  using (
    exists (
      select 1 from public.short_links
      where id = link_id and user_id = auth.uid()
    )
  );

create policy "Allow anonymous inserts for tracking"
  on public.analytics for insert
  with check (true);
