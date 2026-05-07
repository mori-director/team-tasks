'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/database.types'

type Comment = Tables<'comments'>

export default function CommentsPage() {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [taskId, setTaskId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
    fetch('/api/comments')
      .then((r) => r.json())
      .then((d) => { setComments(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const addComment = async () => {
    if (!body.trim() || !taskId.trim() || submitting) return
    setSubmitting(true)
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: body.trim(), task_id: taskId.trim() }),
    })
    const json = await res.json()
    if (res.ok) {
      setComments((prev) => [...prev, json])
      setBody('')
    } else {
      alert(json.error ?? '오류가 발생했습니다')
    }
    setSubmitting(false)
  }

  const deleteComment = async (id: string) => {
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id))
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
        <h1 className="text-xl font-semibold">댓글</h1>
        <div className="flex items-center gap-3">
          {email && <span className="text-sm text-muted-foreground">{email}</span>}
          <Button size="sm" variant="outline" onClick={handleLogout}>로그아웃</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="일감 ID"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="w-72"
        />
        <Input
          placeholder="댓글 내용"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addComment()}
        />
        <Button onClick={addComment} disabled={submitting || !body.trim() || !taskId.trim()}>
          추가
        </Button>
      </div>

      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 rounded-lg border bg-white px-4 py-3">
            <div className="flex-1 space-y-1">
              <p className="text-sm">{comment.body}</p>
              <p className="text-xs text-muted-foreground">일감 ID: {comment.task_id}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => deleteComment(comment.id)}>
              삭제
            </Button>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">댓글이 없습니다</p>
        )}
      </div>
    </div>
  )
}
