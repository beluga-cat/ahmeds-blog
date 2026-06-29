-- Comments table for blog posts
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved BOOLEAN DEFAULT FALSE
);

-- Index for faster queries by post_slug
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public can read approved comments
CREATE POLICY "Public can view approved comments"
  ON comments
  FOR SELECT
  USING (approved = TRUE);

-- Public can insert comments (no auth required)
CREATE POLICY "Public can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (TRUE);

-- No public update or delete (managed via Supabase dashboard)
