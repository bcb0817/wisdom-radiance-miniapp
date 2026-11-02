-- Private health-related results: only verified server-side LINE sessions may access.
-- No anonymous/authenticated policies. The app checks ownership on every request.
create table if not exists public.self_check_results (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.users(id) on delete cascade,
 request_id uuid not null,
 age_range text not null check (age_range in ('30代以下','40〜44歳','45〜49歳','50〜54歳','55〜59歳','60歳以上')),
 awareness_level text not null check (awareness_level in ('aware','maybe','unlikely','never')),
 total_score integer not null check (total_score between 0 and 30),
 burden_level text not null check (burden_level in ('low','moderate','high')),
 top_symptoms jsonb not null check (jsonb_typeof(top_symptoms)='array'),
 answers jsonb not null check (jsonb_typeof(answers)='object'),
 scoring_version text not null,
 consent_version text not null,
 consented_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique(user_id,request_id)
);
alter table public.self_check_results enable row level security;
revoke all on public.self_check_results from anon,authenticated;
grant select,insert,delete on public.self_check_results to service_role;
create index if not exists self_check_results_user_created_idx on public.self_check_results(user_id,created_at desc);
