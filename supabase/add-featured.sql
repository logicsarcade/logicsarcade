-- Run once in Supabase Dashboard → SQL Editor (existing database)
alter table blogs add column if not exists is_featured boolean not null default false;
create index if not exists blogs_featured_idx on blogs(is_featured, created_at desc);
