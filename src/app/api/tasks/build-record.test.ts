import { describe, it, expect } from 'vitest'
import { buildTaskRecord } from './build-record'

const user = { id: 'user-1' }

describe('buildTaskRecord', () => {
  it('assignee_id·status 모두 있으면 그대로 반환', () => {
    const body = { title: '일감', assignee_id: 'other-user', status: 'done' }
    expect(buildTaskRecord(body, user)).toEqual({
      title: '일감',
      assignee_id: 'other-user',
      status: 'done',
      created_by: 'user-1',
    })
  })

  it('assignee_id 없으면 user.id 로 채운다', () => {
    const body = { title: '일감', status: 'done' }
    expect(buildTaskRecord(body, user)).toMatchObject({ assignee_id: 'user-1' })
  })

  it('status 없으면 "todo" 가 기본값이다', () => {
    const body = { title: '일감', assignee_id: 'other-user' }
    expect(buildTaskRecord(body, user)).toMatchObject({ status: 'todo' })
  })

  it('assignee_id·status 모두 없으면 둘 다 기본값이 채워진다', () => {
    const body = { title: '일감' }
    expect(buildTaskRecord(body, user)).toEqual({
      title: '일감',
      assignee_id: 'user-1',
      status: 'todo',
      created_by: 'user-1',
    })
  })

  it('created_by 는 항상 user.id 다', () => {
    const body = { title: '일감', assignee_id: 'other-user', status: 'done' }
    expect(buildTaskRecord(body, user)).toMatchObject({ created_by: 'user-1' })
  })

  it('assignee_id 가 빈 문자열이면 user.id 로 대체하지 않는다 (?? vs || 구분)', () => {
    const body = { title: '일감', assignee_id: '', status: 'done' }
    expect(buildTaskRecord(body, user)).toMatchObject({ assignee_id: '' })
  })
})
