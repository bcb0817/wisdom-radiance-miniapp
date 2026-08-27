-- 公開データと投稿者本人のプロフィールを分離して保護します。
alter table public.users add column if not exists is_blocked boolean not null default false;
alter table public.users add column if not exists role text not null default 'user';
create table if not exists public.moderation_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  unique(display_name)
);
alter table public.users enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_reactions enable row level security;
alter table public.community_reports enable row level security;
alter table public.moderation_blocks enable row level security;
drop policy if exists "published posts readable" on public.community_posts;
create policy "published posts readable" on public.community_posts for select to anon, authenticated using (status = 'published' and not exists (select 1 from public.moderation_blocks b where b.display_name = community_posts.display_name));
drop policy if exists "published comments readable" on public.community_comments;
create policy "published comments readable" on public.community_comments for select to anon, authenticated using (status = 'published' and not exists (select 1 from public.moderation_blocks b where b.display_name = community_comments.display_name));
drop policy if exists "anonymous posts insert" on public.community_posts;
create policy "anonymous posts insert" on public.community_posts for insert to anon, authenticated with check (status = 'published');
drop policy if exists "anonymous comments insert" on public.community_comments;
create policy "anonymous comments insert" on public.community_comments for insert to anon, authenticated with check (status = 'published');
drop policy if exists "anonymous reactions insert" on public.community_reactions;
create policy "anonymous reactions insert" on public.community_reactions for insert to anon, authenticated with check (reaction_type = 'like');
drop policy if exists "anonymous reports insert" on public.community_reports;
create policy "anonymous reports insert" on public.community_reports for insert to anon, authenticated with check (post_id is not null or comment_id is not null);
revoke all on public.moderation_blocks from anon, authenticated;
