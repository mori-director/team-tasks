type Body = { title: string; assignee_id?: string; status?: string }
type User = { id: string }

export function buildTaskRecord(body: Body, user: User) {
  return {
    title: body.title,
    assignee_id: body.assignee_id ?? user.id,
    status: body.status ?? 'todo',
    created_by: user.id,
  }
}
