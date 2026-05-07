CREATE TABLE tags (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  created_by uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY tags_select ON tags
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY tags_insert ON tags
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY tags_update ON tags
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY tags_delete ON tags
  FOR DELETE USING (created_by = auth.uid());
