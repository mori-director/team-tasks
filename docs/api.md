# API 엔드포인트 — team-tasks MVP

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/login | Google OAuth 로그인 페이지로 리다이렉트 | 불필요 |
| GET | /api/auth/callback | OAuth 콜백 처리 후 세션 쿠키 발급 | 불필요 |
| DELETE | /api/auth/logout | 세션 쿠키 삭제 후 로그아웃 | 필요 |
| GET | /api/tasks | 전체 일감 목록 반환 | 필요 |
| POST | /api/tasks | 새 일감 생성 (created_by = 로그인 사용자) | 필요 |
| PATCH | /api/tasks/[id] | 일감 제목·담당자·상태 부분 수정 | 필요 |
| DELETE | /api/tasks/[id] | 일감 삭제 (created_by 본인만) | 필요 |
