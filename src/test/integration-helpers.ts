import { createClient } from '@supabase/supabase-js'
import { createChunks, stringToBase64URL } from '@supabase/ssr'

const PROJECT_REF = 'ripkpnnbvxpafveejaee'
const COOKIE_NAME = `sb-${PROJECT_REF}-auth-token`

export async function waitForDevServer(url = 'http://localhost:3000'): Promise<void> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Status ${res.status}`)
  } catch {
    throw new Error(
      `Dev server not reachable at ${url}.\n별도 터미널에서 npm run dev 먼저 띄우세요.`,
    )
  }
}

export async function signInTestUser(): Promise<{ cookieHeader: string; userId: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  const email = process.env.TEST_USER_EMAIL!
  const password = process.env.TEST_USER_PASSWORD!

  const client = createClient(url, anonKey)
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error || !data.session) throw new Error(`로그인 실패: ${error?.message}`)

  const encoded = 'base64-' + stringToBase64URL(JSON.stringify(data.session))
  const chunks = createChunks(COOKIE_NAME, encoded)
  const cookieHeader = chunks.map((c) => `${c.name}=${c.value}`).join('; ')

  return { cookieHeader, userId: data.session.user.id }
}

export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
