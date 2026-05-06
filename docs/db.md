# DB 설계 — team-tasks MVP

```sql
create table tasks (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  assignee_id uuid        references auth.users,
  created_by  uuid        not null references auth.users,
  status      text        not null default 'todo' check (status in ('todo', 'done')),
  created_at  timestamptz not null default now()
);
```
