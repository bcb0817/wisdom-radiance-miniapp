create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(), line_user_id text unique,
  display_name text not null, age_range text, created_at timestamptz not null default now()
);
create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(), user_id uuid references users(id) on delete set null,
  topic_slug text not null, title text not null, body text not null, age_range text,
  display_name text not null, status text not null default 'published',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists community_comments (
  id uuid primary key default gen_random_uuid(), post_id uuid not null references community_posts(id) on delete cascade,
  user_id uuid references users(id) on delete set null, display_name text not null, body text not null,
  status text not null default 'published', created_at timestamptz not null default now()
);
create table if not exists community_reactions (
  id uuid primary key default gen_random_uuid(), post_id uuid not null references community_posts(id) on delete cascade,
  user_id uuid references users(id) on delete set null, reaction_type text not null default 'like', created_at timestamptz not null default now(),
  unique(post_id,user_id,reaction_type)
);
create table if not exists community_reports (
  id uuid primary key default gen_random_uuid(), post_id uuid references community_posts(id) on delete cascade,
  comment_id uuid references community_comments(id) on delete cascade, reason text not null, created_at timestamptz not null default now(),
  check (post_id is not null or comment_id is not null)
);
create index if not exists community_posts_topic_created_idx on community_posts(topic_slug,created_at desc);
create index if not exists community_comments_post_created_idx on community_comments(post_id,created_at);
