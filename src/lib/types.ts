export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  assignee: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export const TEAM_MEMBERS = [
  '김민준',
  '이서연',
  '박지호',
  '최수아',
  '정현우',
  '강나은',
]

export const STATUS_LABELS: Record<Status, string> = {
  todo: '할 일',
  'in-progress': '진행 중',
  done: '완료',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
}
