create table if not exists public.story_saves (
 user_id uuid not null references public.users(id) on delete cascade,
 story_id text not null check (story_id ~ '^voice-excel-[0-9]+$'),
 created_at timestamptz not null default now(),
 primary key (user_id,story_id)
);
alter table public.story_saves enable row level security;
revoke all on public.story_saves from anon,authenticated;
grant select,insert,update,delete on public.story_saves to service_role;
create index if not exists story_saves_user_created_idx on public.story_saves(user_id,created_at desc);
