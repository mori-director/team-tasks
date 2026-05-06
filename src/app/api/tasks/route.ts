import { NextRequest, NextResponse } from 'next/server'
import { readTasks, writeTasks } from '@/lib/data'
import { Task } from '@/lib/types'
import { randomUUID } from 'crypto'

export async function GET() {
  const tasks = readTasks()
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const tasks = readTasks()

  const now = new Date().toISOString()
  const task: Task = {
    id: randomUUID(),
    title: body.title,
    description: body.description ?? '',
    status: body.status ?? 'todo',
    priority: body.priority ?? 'medium',
    assignee: body.assignee ?? '',
    dueDate: body.dueDate ?? '',
    createdAt: now,
    updatedAt: now,
  }

  tasks.push(task)
  writeTasks(tasks)

  return NextResponse.json(task, { status: 201 })
}
