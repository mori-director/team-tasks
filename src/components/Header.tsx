'use client'

import { Task, STATUS_LABELS, Status } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Props {
  tasks: Task[]
  onAdd: () => void
}

const statusColors: Record<Status, string> = {
  todo: 'bg-slate-200 text-slate-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

export function Header({ tasks, onAdd }: Props) {
  const counts = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-tight">팀 일감 관리</h1>
        <div className="hidden sm:flex items-center gap-2">
          {(Object.keys(counts) as Status[]).map((s) => (
            <span
              key={s}
              className={`text-xs font-medium rounded-full px-2.5 py-1 ${statusColors[s]}`}
            >
              {STATUS_LABELS[s]} {counts[s]}
            </span>
          ))}
        </div>
      </div>
      <Button size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-1" />
        새 일감
      </Button>
    </header>
  )
}
