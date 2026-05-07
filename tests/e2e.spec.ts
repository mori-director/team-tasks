import { test, expect, Page } from '@playwright/test'

const EMAIL = process.env.TEST_USER_EMAIL!
const PASSWORD = process.env.TEST_USER_PASSWORD!

async function login(page: Page) {
  await page.goto('/login')
  await page.getByTestId('email-input').fill(EMAIL)
  await page.getByTestId('password-input').fill(PASSWORD)
  await page.getByTestId('email-login-submit').click()
  await page.waitForURL('/')
}

test.describe('팀 일감 핵심 흐름', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('로그인 — 메인 화면 진입', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '팀 일감' })).toBeVisible()
    await expect(page.getByPlaceholder('새 일감 제목')).toBeVisible()
  })

  test('일감 추가 → 할 일 목록 표시', async ({ page }) => {
    const title = `e2e-${Date.now()}`

    await page.getByPlaceholder('새 일감 제목').fill(title)
    await page.getByRole('button', { name: '추가' }).click()

    await expect(page.getByText(title, { exact: true })).toBeVisible()

    const todoSection = page.locator('section').filter({ hasText: /할 일 \(/ })
    await expect(todoSection.getByText(title, { exact: true })).toBeVisible()

    // cleanup
    const row = page.getByText(title, { exact: true }).locator('..')
    await row.getByRole('button', { name: '삭제' }).click()
  })

  test('상태 토글 — todo → done → todo', async ({ page }) => {
    const title = `e2e-${Date.now()}`

    // 추가
    await page.getByPlaceholder('새 일감 제목').fill(title)
    await page.getByRole('button', { name: '추가' }).click()
    await expect(page.getByText(title, { exact: true })).toBeVisible()

    // todo → done
    const row = page.getByText(title, { exact: true }).locator('..')
    await row.getByRole('button', { name: '완료' }).click()

    const doneSection = page.locator('section').filter({ hasText: /완료 \(/ })
    await expect(doneSection.getByText(title, { exact: true })).toBeVisible()
    await expect(row.getByRole('button', { name: '되돌리기' })).toBeVisible()

    // done → todo (되돌리기)
    await row.getByRole('button', { name: '되돌리기' }).click()

    const todoSection = page.locator('section').filter({ hasText: /할 일 \(/ })
    await expect(todoSection.getByText(title, { exact: true })).toBeVisible()

    // cleanup
    await row.getByRole('button', { name: '삭제' }).click()
  })

  test('일감 삭제 — 목록에서 사라짐', async ({ page }) => {
    const title = `e2e-${Date.now()}`

    await page.getByPlaceholder('새 일감 제목').fill(title)
    await page.getByRole('button', { name: '추가' }).click()
    await expect(page.getByText(title, { exact: true })).toBeVisible()

    const row = page.getByText(title, { exact: true }).locator('..')
    await row.getByRole('button', { name: '삭제' }).click()

    await expect(page.getByText(title, { exact: true })).not.toBeVisible()
  })
})
