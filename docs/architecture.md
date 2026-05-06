# 아키텍처 — team-tasks MVP

```
Browser
  │  HTTPS
  ▼
Vercel ── Next.js (Front + API Routes)
              │  SQL / Auth API
              ▼
          Supabase (Postgres + Auth) ──▶ Google OAuth
```
