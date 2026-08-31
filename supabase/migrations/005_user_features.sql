create table if not exists public.community_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  post_id uuid not null references public.community_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id,post_id)
);
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  status text not null default 'published',
  created_at timestamptz not null default now()
);
alter table public.community_saves enable row level security;
alter table public.announcements enable row level security;
create index if not exists community_saves_user_idx on public.community_saves(user_id,created_at desc);
drop policy if exists "published announcements readable" on public.announcements;
create policy "published announcements readable" on public.announcements for select to anon,authenticated using(status='published');
insert into public.announcements(title,body) select '管理者からのお知らせ','安心してご利用いただけるよう、最新のお知らせを掲載します。' where not exists(select 1 from public.announcements);
