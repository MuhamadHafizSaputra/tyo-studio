-- Create a table to cache AI recommendations per child
create table if not exists public.child_recommendations (
  id uuid not null default uuid_generate_v4(),
  child_id uuid not null references public.children(id) on delete cascade,
  recommendations jsonb not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  
  constraint child_recommendations_pkey primary key (id)
);

-- Add an index on child_id and created_at for faster queries
create index if not exists child_recommendations_child_id_idx on public.child_recommendations (child_id);
create index if not exists child_recommendations_created_at_idx on public.child_recommendations (created_at);

-- Add RLS policies (Optional but recommended)
alter table public.child_recommendations enable row level security;

create policy "Users can view recommendations for their own children"
  on public.child_recommendations for select
  using (
    exists (
      select 1 from public.children
      where children.id = child_recommendations.child_id
      and children.user_id = auth.uid()
    )
  );

create policy "Users can insert recommendations for their own children"
  on public.child_recommendations for insert
  with check (
    exists (
      select 1 from public.children
      where children.id = child_recommendations.child_id
      and children.user_id = auth.uid()
    )
  );
