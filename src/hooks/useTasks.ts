'use client'

import { useCallback, useEffect, useState } from 'react'
import { Task } from '@/lib/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const res = await fetch('/api/tasks')
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const task = await res.json()
    setTasks((prev) => [...prev, task])
    return task
  }

  const updateTask = async (id: string, data: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const updated = await res.json()
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return { tasks, loading, createTask, updateTask, deleteTask, refetch: fetchTasks }
}
