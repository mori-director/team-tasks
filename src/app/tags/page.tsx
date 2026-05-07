'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/database.types'

type Tag = Tables<'tags'>

export default function TagsPage() {
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
    fetch('/api/tags')
      .then((r) => r.json())
      .then((d) => { setTags(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const addTag = async () => {
    if (!name.trim() || submitting) return
    setSubmitting(true)
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })
    const json = await res.json()
    if (res.ok) {
      setTags((prev) => [json, ...prev])
      setName('')
    } else {
      alert(json.error ?? '오류가 발생했습니다')
    }
    setSubmitting(false)
  }

  const deleteTag = async (id: string) => {
    const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTags((prev) => prev.filter((t) => t.id !== id))
    } else {
      const json = await res.json()
      alert(json.error ?? '오류가 발생했습니다')
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        불러오는 중…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">태그</h1>
        <div className="flex items-center gap-3">
          {email && <span className="text-sm text-muted-foreground">{email}</span>}
          <Button size="sm" variant="outline" onClick={handleLogout}>로그아웃</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="태그 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTag()}
        />
        <Button onClick={addTag} disabled={submitting || !name.trim()}>
          추가
        </Button>
      </div>

      <div className="space-y-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3">
            <span className="flex-1 text-sm">{tag.name}</span>
            <Button size="sm" variant="destructive" onClick={() => deleteTag(tag.id)}>
              삭제
            </Button>
          </div>
        ))}
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">태그가 없습니다</p>
        )}
      </div>
    </div>
  )
}
