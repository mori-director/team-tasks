CREATE TABLE comments (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    uuid        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  body       text        NOT NULL,
  created_by uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY comments_select ON comments
  FOR SELECT USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = comments.task_id
        AND (tasks.created_by = auth.uid() OR tasks.assignee_id = auth.uid())
    )
  );

CREATE POLICY comments_insert ON comments
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY comments_update ON comments
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY comments_delete ON comments
  FOR DELETE USING (created_by = auth.uid());
