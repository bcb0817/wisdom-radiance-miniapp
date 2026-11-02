create table if not exists public.story_reactions (
 user_id uuid not null references public.users(id) on delete cascade,
 story_id text not null check (story_id ~ '^voice-excel-[0-9]+$'),
 created_at timestamptz not null default now(),
 primary key (user_id,story_id)
);
alter table public.story_reactions enable row level security;
revoke all on public.story_reactions from anon,authenticated;
grant select,insert,delete on public.story_reactions to service_role;
create index if not exists story_reactions_story_idx on public.story_reactions(story_id);
