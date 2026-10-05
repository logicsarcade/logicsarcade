-- Run once in Supabase Dashboard → SQL Editor
-- Turns on Realtime for every table the website watches.
do $$
declare t text;
begin
  foreach t in array array['projects','testimonials','bookings','blocked_dates','blogs'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
