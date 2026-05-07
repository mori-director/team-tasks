import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// next/navigation mock
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

// Supabase client mock
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: async () => ({ data: { user: { email: 'test@kt.com' } } }), signOut: vi.fn() },
  }),
}))

// fetch mock
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import Home from './page'

const makeTasks = (overrides = {}) => ({
  id: 'task-1',
  title: '테스트 일감',
  status: 'todo',
  created_by: 'user-1',
  assignee_id: null,
  created_at: new Date().toISOString(),
  ...overrides,
})

describe('Home 페이지', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [makeTasks()],
    })
  })

  it('로딩 후 일감 목록을 표시한다', async () => {
    render(<Home />)
    expect(await screen.findByText('테스트 일감')).toBeInTheDocument()
  })

  it('할 일 섹션에 todo 상태 일감이 표시된다', async () => {
    render(<Home />)
    expect(await screen.findByText(/할 일 \(1\)/)).toBeInTheDocument()
  })

  it('완료 섹션이 비어 있으면 없음을 표시한다', async () => {
    render(<Home />)
    await screen.findByText('테스트 일감')
    expect(screen.getAllByText('없음')).toHaveLength(1)
  })

  it('추가 버튼은 제목 입력 전에 비활성화된다', async () => {
    render(<Home />)
    await screen.findByText('테스트 일감')
    expect(screen.getByRole('button', { name: '추가' })).toBeDisabled()
  })

  it('제목 입력 후 추가 버튼이 활성화된다', async () => {
    render(<Home />)
    await screen.findByText('테스트 일감')
    fireEvent.change(screen.getByPlaceholderText('새 일감 제목'), {
      target: { value: '새 일감' },
    })
    expect(screen.getByRole('button', { name: '추가' })).not.toBeDisabled()
  })
})

describe('TaskRow', () => {
  it('done 상태 일감은 완료 뱃지를 표시한다', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [makeTasks({ id: 'task-2', status: 'done', title: '완료된 일감' })],
    })
    render(<Home />)
    expect(await screen.findByText('완료된 일감')).toBeInTheDocument()
    expect(screen.getByText('완료')).toBeInTheDocument()
  })

  it('todo 상태 일감의 토글 버튼 텍스트는 "완료"다', async () => {
    render(<Home />)
    await screen.findByText('테스트 일감')
    const toggleButtons = screen.getAllByRole('button', { name: '완료' })
    expect(toggleButtons.length).toBeGreaterThan(0)
  })
})
