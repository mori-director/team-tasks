import fs from 'fs'
import path from 'path'
import { Task } from './types'

const DATA_FILE = path.join(process.cwd(), 'data', 'tasks.json')

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

export function readTasks(): Task[] {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw) as Task[]
}

export function writeTasks(tasks: Task[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8')
}
