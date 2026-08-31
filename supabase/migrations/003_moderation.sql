drop policy if exists "anonymous posts insert" on public.community_posts;
create policy "anonymous posts insert" on public.community_posts for insert to anon, authenticated with check (status = 'pending');
