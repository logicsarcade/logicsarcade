-- Run once in Supabase Dashboard → SQL Editor (to add direct link_url column)
alter table projects add column if not exists link_url text;
