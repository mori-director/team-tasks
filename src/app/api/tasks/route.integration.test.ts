import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { waitForDevServer, signInTestUser, getAdminSupabase } from '@/test/integration-helpers'

const BASE_URL = 'http://localhost:3000'

let cookieHeader: string
let userId: string
let createdTaskId: string | null = null

beforeAll(async () => {
  await waitForDevServer(BASE_URL)
  const auth = await signInTestUser()
  cookieHeader = auth.cookieHeader
  userId = auth.userId
}, 30_000)

afterEach(async () => {
  if (createdTaskId) {
    const admin = getAdminSupabase()
    await admin.from('tasks').delete().eq('id', createdTaskId)
    createdTaskId = null
  }
})

afterAll(async () => {
  const admin = getAdminSupabase()
  await admin.from('tasks').delete().like('title', 'integration-%')
})

describe('POST /api/tasks', () => {
  it('Cookie 없이 POST → 401', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'integration-unauthorized' }),
    })
    expect(res.status).toBe(401)
  })

  it('title 없이 POST → 400 이상 (DB NOT NULL 제약)', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({}),
    })
    expect(res.status).toBeGreaterThanOrEqual(400)
  })

  it('Cookie 포함 POST → 201, created_by·title 일치', async () => {
    const title = `integration-${Date.now()}`
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({ title }),
    })

    expect(res.status).toBe(201)
    const task = await res.json()
    expect(task.title).toBe(title)
    expect(task.created_by).toBe(userId)

    createdTaskId = task.id
  })
})
