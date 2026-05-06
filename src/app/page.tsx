'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/database.types'

type Task = Tables<'tasks'>

export default function Home() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
    fetch('/api/tasks')
      .then((r) => r.json())
      .then((d) => { setTasks(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const addTask = async () => {
    if (!title.trim() || submitting) return
    setSubmitting(true)
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() }),
    })
    const json = await res.json()
    if (res.ok) {
      setTasks((prev) => [json, ...prev])
      setTitle('')
    } else {
      alert(json.error ?? '오류가 발생했습니다')
    }
    setSubmitting(false)
  }

  const toggleStatus = async (task: Task) => {
    const next = task.status === 'todo' ? 'done' : 'todo'
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    if (res.ok) {
      const updated: Task = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } else {
      const { error } = await res.json()
      alert(error ?? '오류가 발생했습니다')
    }
  }

  const deleteTask = async (task: Task) => {
    const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } else {
      const { error } = await res.json()
      alert(error ?? '오류가 발생했습니다')
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        불러오는 중…
      </div>
    )
  }

  const todo = tasks.filter((t) => t.status === 'todo')
  const done = tasks.filter((t) => t.status === 'done')

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">팀 일감</h1>
        <div className="flex items-center gap-3">
          {email && <span className="text-sm text-muted-foreground">{email}</span>}
          <Button size="sm" variant="outline" onClick={handleLogout}>로그아웃</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="새 일감 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <Button onClick={addTask} disabled={submitting || !title.trim()}>
          추가
        </Button>
      </div>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-2">
          할 일 ({todo.length})
        </h2>
        <div className="space-y-2">
          {todo.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={toggleStatus} onDelete={deleteTask} />
          ))}
          {todo.length === 0 && <p className="text-sm text-muted-foreground">없음</p>}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-2">
          완료 ({done.length})
        </h2>
        <div className="space-y-2">
          {done.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={toggleStatus} onDelete={deleteTask} />
          ))}
          {done.length === 0 && <p className="text-sm text-muted-foreground">없음</p>}
        </div>
      </section>
    </div>
  )
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (task: Task) => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3">
      <span className="flex-1 text-sm">{task.title}</span>
      <Badge variant={task.status === 'done' ? 'secondary' : 'default'}>
        {task.status === 'done' ? '완료' : '할 일'}
      </Badge>
      <Button size="sm" variant="outline" onClick={() => onToggle(task)}>
        {task.status === 'todo' ? '완료' : '되돌리기'}
      </Button>
      <Button size="sm" variant="destructive" onClick={() => onDelete(task)}>
        삭제
      </Button>
    </div>
  )
}
