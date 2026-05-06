ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS created_by  uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DELETE FROM tasks WHERE created_by IS NULL;

ALTER TABLE tasks ALTER COLUMN created_by SET NOT NULL;

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS temp_all_access ON tasks;

DROP POLICY IF EXISTS tasks_select ON tasks;
CREATE POLICY tasks_select ON tasks
  FOR SELECT USING (
    created_by = auth.uid() OR assignee_id = auth.uid()
  );

DROP POLICY IF EXISTS tasks_insert ON tasks;
CREATE POLICY tasks_insert ON tasks
  FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS tasks_update ON tasks;
CREATE POLICY tasks_update ON tasks
  FOR UPDATE USING (
    created_by = auth.uid() OR assignee_id = auth.uid()
  );

DROP POLICY IF EXISTS tasks_delete ON tasks;
CREATE POLICY tasks_delete ON tasks
  FOR DELETE USING (created_by = auth.uid());
