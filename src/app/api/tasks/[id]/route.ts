import { NextRequest, NextResponse } from 'next/server'
import { readTasks, writeTasks } from '@/lib/data'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === id)

  if (index === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  tasks[index] = { ...tasks[index], ...body, id, updatedAt: new Date().toISOString() }
  writeTasks(tasks)

  return NextResponse.json(tasks[index])
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const tasks = readTasks()
  const filtered = tasks.filter((t) => t.id !== id)

  if (filtered.length === tasks.length) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  writeTasks(filtered)
  return NextResponse.json({ success: true })
}
