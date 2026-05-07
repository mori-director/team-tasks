@AGENTS.md

## 기술 스택과 아키텍처

### 구성 부품 (4개 고정)
- **Next.js** — 프론트엔드 + API Routes (`/api/*`) 를 단일 앱으로 제공, Vercel에 배포
- **Supabase** — Postgres DB + Auth 세션 관리 (JWT 쿠키)
- **Google OAuth** — 인증 수단, Supabase Auth가 위임 처리
- **Vercel** — 호스팅 및 CI/CD

> 금지: 메시지 큐·캐시·Read Replica·WebSocket·마이크로서비스 추가 불가.
> 상세는 docs/architecture.md 참조.

### API 규칙
- base path `/api`, 버전 prefix 금지 (`/api/v1/` 불가)
- 인증이 필요한 엔드포인트는 Supabase 세션 쿠키로 서버에서 검증
- `DELETE /api/tasks/[id]` 는 `created_by = 로그인 사용자` 일 때만 허용
- 상세는 docs/api.md 참조.

### DB 규칙
- 테이블: `tasks`(일감), `comments`(댓글) — 각 컬럼 정의는 docs/db.md 참조
- `status` 는 `text check (status in ('todo', 'done'))` — ENUM 타입 사용 금지
- 인덱스·트리거·SQL 인라인 주석 추가 금지
- RLS는 auth.uid() 기반으로 테이블마다 적용
- 상세는 docs/db.md 참조.

### 기능 범위 (MVP 5개)
- F-01 일감 CRUD / F-02 칸반 보드 3컬럼 / F-03 담당자·우선순위 필터
- F-04 마감일 초과 빨간 강조 / F-05 설명 자유 텍스트 (덮어쓰기, 이력 없음)
- 필터 값은 `localStorage` 에 저장해 새로고침 후 유지
- 상세는 docs/requirements.md 참조.

---

## 도메인 용어

| 용어 | 의미 | DB 컬럼 |
|------|------|---------|
| 일감 | 팀이 처리하는 작업 단위, `tasks` 테이블 행 하나 | — |
| 담당자 | 일감을 실행할 팀원 | `assignee_id` |
| 작성자 | 일감을 생성한 사람 (삭제 권한 보유) | `created_by` |
| 상태 | 일감의 진행 단계 (`todo` \| `done`) | `status` |
| 칸반 보드 | 상태별 컬럼(할 일·진행 중·완료)으로 일감을 시각화한 화면 | — |
| 댓글 | 일감에 달리는 텍스트 메모 | `comments` 테이블 |
