---
name: scaffold-crud
description: >
  사용자가 새 리소스의 CRUD를 요청할 때 자동 호출한다.
  DB 마이그레이션 → TypeScript 타입 동기화 → API Routes → UI 페이지를 한 번에 스캐폴딩한다.
allowed-tools:
  - Read
  - Write
  - Edit
  - mcp__plugin_supabase_supabase__apply_migration
  - mcp__plugin_supabase_supabase__generate_typescript_types
---

# scaffold-crud

## 사용 시점

다음 표현이 나오면 자동으로 호출한다.

- "CRUD 만들어 주십시오 / 추가해 주십시오"
- "단일 테이블 추가해 주십시오"
- "`<리소스명>` 기능 만들어 주십시오" (tasks·comments 제외, 이미 존재)
- "새 테이블 + API + 페이지 한 번에"

이미 존재하는 테이블(tasks, comments)에 대한 요청은 기존 파일을 편집하고 이 스킬을 호출하지 않는다.

## 진행 순서

1. **리소스명 결정** — 항상 복수형 소문자 (`tag` → `tags`, `project` → `projects`)
2. **컬럼 정의 확인** — 사용자에게 컬럼 목록을 요청하거나 요청에서 추출; `id · created_by · created_at` 는 기본 포함
3. **마이그레이션 적용** — `apply_migration` 으로 `CREATE TABLE` + RLS 4정책 한 번에 실행
4. **타입 동기화** — `generate_typescript_types` 로 `src/lib/database.types.ts` 재생성
5. **API Routes 생성**
   - `src/app/api/<resource>/route.ts` — `GET` (목록), `POST` (생성)
   - `src/app/api/<resource>/[id]/route.ts` — `GET` (단건), `PATCH` (수정), `DELETE` (삭제)
6. **UI 페이지 생성** — `src/app/<resource>/page.tsx` — 목록 + 생성 폼 + 삭제 버튼

## 컨벤션

**파일 경로**
```
src/app/api/<resource>/route.ts
src/app/api/<resource>/[id]/route.ts
src/app/<resource>/page.tsx
```

**인증** — 모든 API 핸들러 첫 두 줄 고정
```ts
const supabase = await createClient()        // '@/lib/supabase/server'
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
```

**응답 형식**
| 메서드 | 성공 상태 | 본문 |
|--------|-----------|------|
| GET (목록) | 200 | JSON 배열 |
| GET (단건) | 200 | JSON 단건 |
| POST | 201 | JSON 단건 |
| PATCH | 200 | JSON 단건 |
| DELETE | 204 | 본문 없음 |

**PATCH 화이트리스트** — `body` 를 그대로 전달하지 않고, 허용 필드 목록을 순회해 `patch` 객체를 구성한다 (`src/app/api/tasks/[id]/route.ts` 참고)

**UI 라이브러리** — shadcn/ui 컴포넌트 (`Button`, `Input`, `Badge`, `Card` 등) 사용; `'use client'` 선언 + `useState` / `fetch` 패턴 유지

**`created_by`** — 클라이언트 입력을 받지 않고 서버에서 항상 `user.id` 주입

## 주의사항

- **복수형 필수** — 테이블명과 API 경로가 일치해야 한다 (`/api/tag` 불가 → `/api/tags`)
- **RLS 4정책** — SELECT / INSERT / UPDATE / DELETE 전부 작성; 하나라도 누락되면 해당 작업이 전체 차단됨
- **`created_by` NOT NULL** — 마이그레이션에 `NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE` 명시
- **nullable FK** — `assignee_id` 같은 선택적 FK 는 `ON DELETE SET NULL`
- **ENUM 금지** — `status` 류 컬럼은 `text check (col in ('a','b'))` 형태만 허용
- **인덱스·트리거·SQL 인라인 주석 추가 금지** — CLAUDE.md 규칙 준수
- **DELETE 권한** — `created_by = auth.uid()` 조건만 허용; `assignee_id` 기반 삭제 불가
