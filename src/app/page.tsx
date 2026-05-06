'use client'

import { useState } from 'react'
import { Task, Status, TEAM_MEMBERS, PRIORITY_LABELS, Priority } from '@/lib/types'
import { useTasks } from '@/hooks/useTasks'
import { Header } from '@/components/Header'
import { TaskBoard } from '@/components/TaskBoard'
import { TaskForm } from '@/components/TaskForm'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Home() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<Status>('todo')
  const [filter, setFilter] = useState({ assignee: '', priority: '' })

  const openCreate = (status: Status = 'todo') => {
    setEditing(null)
    setDefaultStatus(status)
    setFormOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditing(task)
    setFormOpen(true)
  }

  const handleSubmit = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) {
      await updateTask(editing.id, data)
    } else {
      await createTask(data)
    }
  }

  const handleMove = async (id: string, status: Status) => {
    await updateTask(id, { status })
  }

  const setF = (key: string, value: string | null) =>
    setFilter((prev) => ({ ...prev, [key]: value ?? '' }))

  return (
    <div className="flex flex-col h-full">
      <Header tasks={tasks} onAdd={() => openCreate()} />

      {/* Filter bar */}
      <div className="bg-white border-b px-6 py-2 flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-medium">필터</span>
        <Select
          value={filter.assignee || '_all'}
          onValueChange={(v) => setF('assignee', v === '_all' ? '' : v)}
        >
          <SelectTrigger className="h-7 text-xs w-32">
            <SelectValue placeholder="담당자" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">전체 담당자</SelectItem>
            {TEAM_MEMBERS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filter.priority || '_all'}
          onValueChange={(v) => setF('priority', v === '_all' ? '' : v)}
        >
          <SelectTrigger className="h-7 text-xs w-28">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">전체 우선순위</SelectItem>
            {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filter.assignee || filter.priority) && (
          <button
            onClick={() => setFilter({ assignee: '', priority: '' })}
            className="text-xs text-blue-600 hover:underline"
          >
            초기화
          </button>
        )}
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
          불러오는 중...
        </div>
      ) : (
        <TaskBoard
          tasks={tasks}
          filter={filter}
          onEdit={openEdit}
          onDelete={deleteTask}
          onMove={handleMove}
          onAddInColumn={openCreate}
        />
      )}

      <TaskForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        initial={editing ?? undefined}
        defaultStatus={defaultStatus}
      />
    </div>
  )
}
