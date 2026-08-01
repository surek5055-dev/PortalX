-- # Portfolio Builder CMS Schema
-- 1. Overview: multi-user Portfolio Builder CMS.
--   profiles  - per-user portfolio content (about, contact, resume, social, SEO, theme) + role (user/admin).
--   projects  - portfolio project entries (image, link, tags, featured).
--   skills    - skill entries (level, category).
--   blog_posts- blog articles (slug, excerpt, content, image, published).
--   storage bucket portfolio-images for user uploads.
-- 2. Security: RLS on all tables. Public SELECT on profiles/projects/skills.
--   Blog: public SELECT published only; owners SELECT all own posts.
--   INSERT/UPDATE/DELETE owner-scoped, user_id DEFAULT auth.uid().
--   role column protected by trigger (only service role may change). First profile auto-admin.
-- 3. Storage: public bucket, authenticated users manage only their own folder user_id/*.

-- ===== profiles =====
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  contact_email text DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  resume_url text DEFAULT '',
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  theme text NOT NULL DEFAULT 'light',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles"
ON profiles FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "owner_insert_profile" ON profiles;
CREATE POLICY "owner_insert_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "owner_update_profile" ON profiles;
CREATE POLICY "owner_update_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ===== projects =====
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  project_url text DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects"
ON projects FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "owner_insert_project" ON projects;
CREATE POLICY "owner_insert_project"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_project" ON projects;
CREATE POLICY "owner_update_project"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_project" ON projects;
CREATE POLICY "owner_delete_project"
ON projects FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ===== skills =====
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  level int NOT NULL DEFAULT 50,
  category text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills"
ON skills FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "owner_insert_skill" ON skills;
CREATE POLICY "owner_insert_skill"
ON skills FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_skill" ON skills;
CREATE POLICY "owner_update_skill"
ON skills FOR UPDATE
TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_skill" ON skills;
CREATE POLICY "owner_delete_skill"
ON skills FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ===== blog_posts =====
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  slug text NOT NULL DEFAULT '',
  excerpt text DEFAULT '',
  content text DEFAULT '',
  image_url text DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_posts" ON blog_posts;
CREATE POLICY "public_read_published_posts"
ON blog_posts FOR SELECT
TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "owner_read_posts" ON blog_posts;
CREATE POLICY "owner_read_posts"
ON blog_posts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_post" ON blog_posts;
CREATE POLICY "owner_insert_post"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_post" ON blog_posts;
CREATE POLICY "owner_update_post"
ON blog_posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_post" ON blog_posts;
CREATE POLICY "owner_delete_post"
ON blog_posts FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ===== Role protection trigger =====
CREATE OR REPLACE FUNCTION protect_profile_role()
RETURNS trigger AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF current_user IN ('postgres', 'supabase_admin', 'authenticator') = false THEN
      RAISE EXCEPTION 'You are not allowed to change your role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON profiles;
CREATE TRIGGER trg_protect_profile_role
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION protect_profile_role();

-- ===== Auto-admin first profile =====
CREATE OR REPLACE FUNCTION auto_admin_first_profile()
RETURNS trigger AS $$
BEGIN
  IF (SELECT count(*) FROM profiles) = 0 THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_admin_first_profile ON profiles;
CREATE TRIGGER trg_auto_admin_first_profile
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION auto_admin_first_profile();

-- ===== Storage bucket =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_portfolio_images" ON storage.objects;
CREATE POLICY "public_read_portfolio_images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "owner_insert_portfolio_image" ON storage.objects;
CREATE POLICY "owner_insert_portfolio_image"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "owner_update_portfolio_image" ON storage.objects;
CREATE POLICY "owner_update_portfolio_image"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "owner_delete_portfolio_image" ON storage.objects;
CREATE POLICY "owner_delete_portfolio_image"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);
