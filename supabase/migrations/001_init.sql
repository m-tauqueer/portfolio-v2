-- Portfolio tables
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id          INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  bio         TEXT NOT NULL,
  location    TEXT NOT NULL,
  email       TEXT NOT NULL,
  resume_url  TEXT DEFAULT '',
  interests   TEXT[] DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_social (
  id          SERIAL PRIMARY KEY,
  platform    TEXT NOT NULL,
  url         TEXT DEFAULT '',
  label       TEXT NOT NULL,
  sort_order  INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_skills (
  id          SERIAL PRIMARY KEY,
  category    TEXT NOT NULL,
  items       TEXT[] NOT NULL,
  sort_order  INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_education (
  id          SERIAL PRIMARY KEY,
  degree      TEXT NOT NULL,
  school      TEXT NOT NULL,
  duration    TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order  INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  stack       TEXT[] NOT NULL,
  github_url  TEXT DEFAULT '',
  demo_url    TEXT DEFAULT '',
  featured    BOOLEAN DEFAULT false,
  sort_order  INT DEFAULT 0
);

-- RLS
ALTER TABLE portfolio_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read profile" ON portfolio_profile;
DROP POLICY IF EXISTS "public read social" ON portfolio_social;
DROP POLICY IF EXISTS "public read skills" ON portfolio_skills;
DROP POLICY IF EXISTS "public read education" ON portfolio_education;
DROP POLICY IF EXISTS "public read projects" ON portfolio_projects;

CREATE POLICY "public read profile" ON portfolio_profile FOR SELECT USING (true);
CREATE POLICY "public read social" ON portfolio_social FOR SELECT USING (true);
CREATE POLICY "public read skills" ON portfolio_skills FOR SELECT USING (true);
CREATE POLICY "public read education" ON portfolio_education FOR SELECT USING (true);
CREATE POLICY "public read projects" ON portfolio_projects FOR SELECT USING (true);
