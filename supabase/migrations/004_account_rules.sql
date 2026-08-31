-- LINE IDと匿名名を一意にし、同一ユーザーの重複アカウントを防ぎます。
create unique index if not exists users_display_name_unique_idx on public.users(lower(display_name));
alter table public.community_posts drop constraint if exists community_posts_status_check;
alter table public.community_posts add constraint community_posts_status_check check (status in ('pending','published','rejected','deleted'));
