'use client'

import { Task, Priority, Status, STATUS_LABELS, PRIORITY_LABELS } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, ArrowRight } from 'lucide-react'

const priorityVariant: Record<Priority, 'default' | 'secondary' | 'destructive'> = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
}

const statusOrder: Status[] = ['todo', 'in-progress', 'done']

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Status) => void
}

export function TaskCard({ task, onEdit, onDelete, onMove }: Props) {
  const isOverdue =
    task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date()

  return (
    <div className="bg-white rounded-lg border shadow-sm p-3 space-y-2 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-sm font-medium leading-snug cursor-pointer hover:text-blue-600 flex-1"
          onClick={() => onEdit(task)}
        >
          {task.title}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              수정
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArrowRight className="mr-2 h-3.5 w-3.5" />
                이동
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {statusOrder
                  .filter((s) => s !== task.status)
                  .map((s) => (
                    <DropdownMenuItem key={s} onClick={() => onMove(task.id, s)}>
                      {STATUS_LABELS[s]}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge variant={priorityVariant[task.priority]} className="text-xs px-1.5 py-0">
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        {task.assignee && (
          <span className="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5">
            {task.assignee}
          </span>
        )}
        {task.dueDate && (
          <span
            className={`text-xs ml-auto ${
              isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'
            }`}
          >
            {task.dueDate}
          </span>
        )}
      </div>
    </div>
  )
}
