-- ============================================================
--  LogicsArcade — Complete Supabase Schema
--  Fresh database pe poora run karo.
--  Agar tables already exist karti hain to pehle yeh run karo:
--    drop schema public cascade; create schema public;
-- ============================================================

-- ─── PROFILES ────────────────────────────────────────────────

create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  full_name   text,
  avatar_url  text
);

alter table profiles enable row level security;

do $$ begin
  if not exists (
    select 1
    from pg_policies
    where tablename = 'profiles'
      and policyname = 'Users can read own profile'
  ) then
    create policy "Users can read own profile"
      on profiles
      for select
      using (auth.uid() = id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1
    from pg_policies
    where tablename = 'profiles'
      and policyname = 'Users can update own profile'
  ) then
    create policy "Users can update own profile"
      on profiles
      for update
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1
    from pg_policies
    where tablename = 'profiles'
      and policyname = 'Admins can manage profiles'
  ) then
    create policy "Admins can manage profiles"
      on profiles
      for all
      using (auth.role() = 'authenticated');
  end if;
end $$;

-- ─── PROJECTS ────────────────────────────────────────────────

create table if not exists projects (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text        not null,
  category     text        not null,
  description  text        not null,
  tech_stack   text[]      not null default '{}',
  result       text        not null,
  result_label text        not null,
  accent       text        not null default 'cyan',
  featured     boolean     not null default false,
  sort_order   int         not null default 0,
  image_url    text
);

alter table projects enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'projects' and policyname = 'Projects are publicly readable'
  ) then
    create policy "Projects are publicly readable"
      on projects for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'projects' and policyname = 'Admins can manage projects'
  ) then
    create policy "Admins can manage projects"
      on projects for all using (auth.role() = 'authenticated');
  end if;
end $$;


-- ─── TESTIMONIALS ────────────────────────────────────────────

create table if not exists testimonials (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  author_name text        not null,
  author_role text        not null,
  initials    text        not null,
  avatar_grad text        not null default 'linear-gradient(135deg,#7c3aed,#4c1d95)',
  review_text text        not null,
  rating      int         not null default 5 check (rating between 1 and 5),
  is_visible  boolean     not null default true,
  sort_order  int         not null default 0
);

alter table testimonials enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'testimonials' and policyname = 'Testimonials are publicly readable'
  ) then
    create policy "Testimonials are publicly readable"
      on testimonials for select using (is_visible = true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'testimonials' and policyname = 'Admins can manage testimonials'
  ) then
    create policy "Admins can manage testimonials"
      on testimonials for all using (auth.role() = 'authenticated');
  end if;
end $$;


-- ─── BOOKINGS ────────────────────────────────────────────────

create table if not exists bookings (
  id             uuid        primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  full_name      text        not null,
  email          text        not null,
  phone          text,
  company        text,
  service        text        not null,
  budget         text        not null,
  timeline       text        not null,
  project_desc   text        not null,
  preferred_date date        not null,
  preferred_time text        not null,
  timezone       text        not null default 'Asia/Karachi',
  status         text        not null default 'pending',
  admin_notes    text,
  constraint bookings_status_check
    check (status in ('pending','confirmed','cancelled','completed')),
  constraint bookings_email_check
    check (email ~* '^[^@]+@[^@]+\.[^@]+$')
);

alter table bookings enable row level security;

create index if not exists bookings_status_idx on bookings(status);
create index if not exists bookings_date_idx   on bookings(preferred_date);
create index if not exists bookings_email_idx  on bookings(email);

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'bookings' and policyname = 'Anyone can create a booking'
  ) then
    create policy "Anyone can create a booking"
      on bookings for insert with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'bookings' and policyname = 'Users can read own bookings'
  ) then
    create policy "Users can read own bookings"
      on bookings for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'bookings' and policyname = 'Admins can manage bookings'
  ) then
    create policy "Admins can manage bookings"
      on bookings for all using (auth.role() = 'authenticated');
  end if;
end $$;


-- ─── BLOCKED DATES ───────────────────────────────────────────

create table if not exists blocked_dates (
  id           uuid primary key default gen_random_uuid(),
  blocked_date date not null unique,
  reason       text
);

alter table blocked_dates enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'blocked_dates' and policyname = 'Blocked dates publicly readable'
  ) then
    create policy "Blocked dates publicly readable"
      on blocked_dates for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'blocked_dates' and policyname = 'Admins manage blocked dates'
  ) then
    create policy "Admins manage blocked dates"
      on blocked_dates for all using (auth.role() = 'authenticated');
  end if;
end $$;


-- ─── SEED DATA ───────────────────────────────────────────────
-- on conflict do nothing = agar data already hai to skip karo

insert into projects
  (name, category, description, tech_stack, result, result_label, accent, featured, sort_order)
values
  (
    'MineWords - Blog and magazine for curious readers',
    'Website',
    'Freelancing Tips, Online Earning Guides & Creative Stories for Pakistani Readers.',
    '{Next.js,Node.js,MySQL}',
    '↑340%', 'revenue in 6mo', 'cyan', true, 1
  ),
  (
    'Arcade Shipping Calculator',
    'Shopify App',
    'Smart shipping rules by country, state, city & zip — no zones needed',
    '{React.Js,Node.js,MySQL,Shopify Polaris}',
    '↑228%', 'revenue in 1y', 'cyan', false, 3
  ),
  (
    'TradeSync — Crypto Portfolio',
    'Mobile App',
    'React Native app with live price feeds, AI trade signals, and biometric auth. 50k+ downloads on launch week.',
    '{React Native,Redux}',
    '50k+', 'downloads', 'violet', false, 2
  )
on conflict do nothing;

insert into testimonials
  (author_name, author_role, initials, avatar_grad, review_text, rating, sort_order)
values
  (
    'Adam Karim', 'CEO, Northcloud Inc.', 'AK',
    'linear-gradient(135deg,#7c3aed,#4c1d95)',
    'They delivered our SaaS MVP in 8 weeks — something two other agencies said would take 6 months. Code quality is exceptional and the team communicates like partners, not vendors.',
    5, 1
  ),
  (
    'Sarah Rahman', 'Founder, LuxeStore', 'SR',
    'linear-gradient(135deg,#00f5ff,#0284c7)',
    'Our Shopify revenue jumped 40% in the first month after launching the custom app they built. The AI recommendations are scarily accurate. Absolutely recommend.',
    5, 2
  ),
  (
    'Marcus Johnson', 'CTO, FinPulse', 'MJ',
    'linear-gradient(135deg,#10b981,#065f46)',
    'Best technical team I''ve worked with in 10 years of building startups. They thought through edge cases I hadn''t even considered. Launched with zero major bugs.',
    5, 3
  )
on conflict do nothing;

insert into blocked_dates (blocked_date, reason)
values
  (current_date + interval '7 days', 'Team offsite'),
  (current_date + interval '8 days', 'Team offsite')
on conflict do nothing;

