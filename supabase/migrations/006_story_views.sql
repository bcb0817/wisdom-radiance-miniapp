-- Run once in Supabase SQL Editor. Raw visitor identifiers are server-only.
create table if not exists public.story_daily_views (
  story_id text not null,
  view_day date not null,
  visitor_id uuid not null,
  primary key (story_id, view_day, visitor_id)
);
alter table public.story_daily_views enable row level security;
revoke all on public.story_daily_views from anon, authenticated;
grant select, insert, delete on public.story_daily_views to service_role;
create index if not exists story_daily_views_day_idx on public.story_daily_views(view_day);

create or replace function public.weekly_story_ranking()
returns table (story_id text, views bigint)
language sql stable security invoker set search_path = public
as $$
  select v.story_id, count(*) as views
  from public.story_daily_views v
  where v.view_day >= date_trunc('week', now() at time zone 'Asia/Tokyo')::date
    and v.view_day <= (now() at time zone 'Asia/Tokyo')::date
  group by v.story_id
  order by views desc, v.story_id asc;
$$;
revoke all on function public.weekly_story_ranking() from public, anon, authenticated;
grant execute on function public.weekly_story_ranking() to service_role;
