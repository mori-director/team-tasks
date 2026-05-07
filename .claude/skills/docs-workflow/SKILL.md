---
name: docs-workflow
description: >
  docs/ 폴더에 프로젝트 문서를 처음부터 순서대로 작성할 때 사용한다.
  페르소나 → 유저 시나리오 → 아키텍처 → DB → API 순서로 각 문서를 생성하며,
  앞 단계 문서를 참고해 내용 일관성을 보장한다.
  "문서 만들어줘", "docs 작성해줘", "페르소나부터 API까지 문서화", "프로젝트 문서 처음부터"
  등의 요청이 들어오면 반드시 이 스킬을 사용한다. docs/ 안의 문서를 새로 만들거나
  재작성하는 모든 상황에서 호출해야 한다.
---

# docs-workflow

## 개요

`docs/` 폴더에 프로젝트 문서를 **5단계 순서**로 작성하는 워크플로우.
각 문서는 이전 문서의 내용을 참고해 용어와 구조의 일관성을 유지한다.

```
1. 페르소나  →  2. 유저 시나리오  →  3. 아키텍처  →  4. DB  →  5. API
```

앞 단계 문서가 없으면 다음 단계로 넘어가지 않는다.

---

## 시작 전 확인 (필수)

1. `docs/` 폴더 안에 이미 존재하는 파일 목록을 확인한다.
2. 이미 있는 파일은 **덮어쓰기 전에 사용자에게 확인**을 받는다.
3. 어느 단계부터 시작할지 사용자에게 묻는다.
   - "처음부터" → 1단계부터
   - "아키텍처부터" → 3단계부터 (단, 1·2단계 파일이 존재해야 함)

---

## 단계별 작업

### 1단계 — 페르소나 (`docs/personas.md`)

**목적**: 서비스를 사용하는 사람 2-3명을 정의한다.

**정보 수집** — 사용자에게 물어볼 것:
- 프로젝트 이름과 한 줄 목적
- 주요 사용자 그룹과 역할 (2-3명)
- 각 페르소나의 기술 수준 (개발자 / 비개발자 / 혼합)
- 각 페르소나가 앱을 쓰는 대표 장면 3가지

**출력 형식**:
```markdown
# 페르소나 — [프로젝트명]

> **MVP 헌장** : [핵심 제약 한 줄]

| 구분 | 역할 | 기술 수준 | 주요 시나리오 |
|------|------|-----------|--------------|
| **P1 [이름]** | [역할 설명] | [수준] | ① ... ② ... ③ ... |
| **P2 [이름]** | [역할 설명] | [수준] | ① ... ② ... ③ ... |
```

---

### 2단계 — 유저 시나리오 (`docs/user-stories.md`)

**참고 필수**: `docs/personas.md` 를 읽어 페르소나 이름·역할을 반영한다.

**목적**: 핵심 페르소나 1명이 하루를 어떻게 보내는지 시간 순서로 기술한다.
핵심 페르소나는 앱을 가장 많이 쓰는 사람(보통 P1 또는 P2)으로 선택한다.

**출력 형식**:
```markdown
# 유저 스토리 — [프로젝트명] MVP

## 1. 핵심 시나리오 — [페르소나명]

> [한 줄 컨텍스트 설명]

| 시간 | 행동 | 앱에서 하는 일 | 기대 결과 |
|------|------|----------------|-----------|
| **09:00** [상황] | [행동 요약] | [구체적 조작] | [화면·데이터 변화] |

### 이 시나리오가 전제하는 MVP 기능

1. [기능명] — [한 줄 설명]
2. ...

---

## 2. 결정 사항

시나리오에서 도출한 미결 질문 3-5개.

1. **"[질문 제목]"** [판단에 따라 구현 범위가 달라지는 이유]
```

---

### 3단계 — 아키텍처 (`docs/architecture.md`)

**참고 필수**: `docs/user-stories.md` 의 MVP 기능 목록을 보고 필요한 구성 요소를 결정한다.

**목적**: 시스템 컴포넌트와 데이터 흐름을 ASCII 다이어그램으로 표현한다.

**CLAUDE.md 기술 스택 제약 준수**:
- 고정 구성: Next.js + Supabase (Postgres + Auth) + Google OAuth + Vercel
- 추가 금지: 메시지 큐·캐시·Read Replica·WebSocket·마이크로서비스

**출력 형식**:
```markdown
# 아키텍처 — [프로젝트명] MVP

```
Browser
  │  HTTPS
  ▼
Vercel ── Next.js (Front + API Routes)
              │  SQL / Auth API
              ▼
          Supabase (Postgres + Auth) ──▶ Google OAuth
```
```

---

### 4단계 — DB (`docs/db.md`)

**참고 필수**: `docs/architecture.md` + `docs/user-stories.md` 의 MVP 기능 목록을 바탕으로 설계한다.

**목적**: 필요한 테이블과 컬럼을 SQL CREATE TABLE 문으로 정의한다.

**CLAUDE.md DB 규칙 (어기면 안 됨)**:
| 규칙 | 올바른 예 | 금지 예 |
|------|-----------|---------|
| status 류 컬럼 | `text check (status in ('a','b'))` | `ENUM` 타입 |
| 기본 컬럼 3개 | `id uuid primary key default gen_random_uuid()` + `created_by uuid not null references auth.users` + `created_at timestamptz not null default now()` | 생략 |
| 선택적 FK | `references auth.users ON DELETE SET NULL` | `NOT NULL` FK |
| 인덱스·트리거·SQL 주석 | 작성 금지 | — |

**출력 형식**:
```markdown
# DB 설계 — [프로젝트명] MVP

```sql
create table [table_name] (
  id          uuid        primary key default gen_random_uuid(),
  [컬럼들...]
  created_by  uuid        not null references auth.users,
  created_at  timestamptz not null default now()
);
```
```

---

### 5단계 — API (`docs/api.md`)

**참고 필수**: `docs/db.md` 의 테이블 구조를 기반으로 CRUD 엔드포인트를 설계한다.

**목적**: REST 엔드포인트 목록을 표로 정의한다.

**CLAUDE.md API 규칙 (어기면 안 됨)**:
| 규칙 | 올바른 예 | 금지 예 |
|------|-----------|---------|
| base path | `/api/tasks` | `/api/v1/tasks` |
| DELETE 권한 | `created_by = 로그인 사용자` 일 때만 | assignee 기반 삭제 |
| 인증 방식 | Supabase 세션 쿠키 (서버 검증) | — |

**출력 형식**:
```markdown
# API 엔드포인트 — [프로젝트명] MVP

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET    | /api/auth/login          | Google OAuth 로그인 리다이렉트 | 불필요 |
| GET    | /api/auth/callback       | OAuth 콜백 처리 + 세션 발급 | 불필요 |
| DELETE | /api/auth/logout         | 세션 삭제 후 로그아웃 | 필요 |
| GET    | /api/[resource]          | 전체 목록 반환 | 필요 |
| POST   | /api/[resource]          | 새 항목 생성 | 필요 |
| PATCH  | /api/[resource]/[id]     | 항목 부분 수정 | 필요 |
| DELETE | /api/[resource]/[id]     | 항목 삭제 (created_by 본인만) | 필요 |
```

---

## 완료 체크리스트

모든 단계를 마친 뒤 사용자에게 완료를 알린다.

- [ ] `docs/personas.md` 작성 완료
- [ ] `docs/user-stories.md` 작성 완료 (personas.md 참조)
- [ ] `docs/architecture.md` 작성 완료 (user-stories.md 참조)
- [ ] `docs/db.md` 작성 완료 (architecture.md 참조)
- [ ] `docs/api.md` 작성 완료 (db.md 참조)

완료 후 안내:
> "문서가 모두 작성되었습니다. `scaffold-crud` 스킬을 사용하면 DB 마이그레이션과 코드를 한 번에 생성할 수 있습니다."

---

## 주의사항

- **용어 일관성**: CLAUDE.md 도메인 용어표(일감·담당자·작성자·상태·칸반 보드·댓글)를 문서 전반에서 일관되게 사용한다.
- **정보 부족 시**: 단계를 강제로 진행하지 않고 사용자에게 필요한 정보를 질문한다.
- **기존 파일 보호**: 이미 존재하는 파일을 덮어쓰기 전에 항상 사용자 확인을 받는다.
