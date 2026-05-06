'use client'

import { Task, Status, STATUS_LABELS } from '@/lib/types'
import { TaskCard } from './TaskCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const COLUMNS: { status: Status; color: string; dot: string }[] = [
  { status: 'todo', color: 'bg-slate-100', dot: 'bg-slate-400' },
  { status: 'in-progress', color: 'bg-blue-50', dot: 'bg-blue-500' },
  { status: 'done', color: 'bg-green-50', dot: 'bg-green-500' },
]

interface Props {
  tasks: Task[]
  filter: { assignee: string; priority: string }
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Status) => void
  onAddInColumn: (status: Status) => void
}

export function TaskBoard({ tasks, filter, onEdit, onDelete, onMove, onAddInColumn }: Props) {
  const filtered = tasks.filter((t) => {
    if (filter.assignee && t.assignee !== filter.assignee) return false
    if (filter.priority && t.priority !== filter.priority) return false
    return true
  })

  return (
    <div className="flex gap-4 p-6 overflow-x-auto flex-1 items-start">
      {COLUMNS.map(({ status, color, dot }) => {
        const columnTasks = filtered.filter((t) => t.status === status)
        return (
          <div key={status} className="flex flex-col gap-3 min-w-[300px] w-[300px] shrink-0">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                <span className="text-sm font-semibold text-slate-700">
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-xs text-muted-foreground bg-muted rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {columnTasks.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onAddInColumn(status)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className={`rounded-xl ${color} p-2 space-y-2 min-h-[120px]`}>
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                  일감이 없습니다
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMove={onMove}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
