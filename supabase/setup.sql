-- ============================================================
-- RUN THIS ENTIRE FILE in Supabase SQL Editor (one paste)
-- Dashboard → SQL → New query → paste → Run
-- ============================================================

-- Tables
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
  image_url   TEXT DEFAULT '',
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

-- Upgrade existing DBs (safe to re-run)
ALTER TABLE portfolio_projects ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- Seed: Profile
INSERT INTO portfolio_profile (id, name, title, bio, location, email, resume_url, interests)
VALUES (
  1,
  'Mohammad Tauqueer',
  'Software Engineer',
  'I''m Tauqueer — Bangalore engineer, CS @ BITS Pilani. Currently on the engineering side at Metacognition, where I shipped Engram — an FPA that gives AI agents memory that actually sticks. Side quests: meet-bot, Staygrad, and writing Unix shells in Java because POSIX won''t implement itself. Cinematography, OSC & Reinforce Club eat whatever RAM is left.',
  'Bangalore, Karnataka',
  'tauqueer655@gmail.com',
  '',
  ARRAY['Cinematography', 'OSC (Open Source Club)', 'Reinforce Club (Member)']
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  email = EXCLUDED.email,
  interests = EXCLUDED.interests,
  updated_at = now();

-- Seed: Social
DELETE FROM portfolio_social;
INSERT INTO portfolio_social (platform, url, label, sort_order) VALUES
  ('github', 'https://github.com/m-tauqueer', 'GitHub', 1),
  ('linkedin', 'https://www.linkedin.com/in/mohammad-tauqueer-693a30201/', 'LinkedIn', 2),
  ('instagram', 'https://www.instagram.com/rather_tauqueer/', 'Instagram', 3),
  ('twitter', '', 'Twitter', 4);

-- Seed: Skills
DELETE FROM portfolio_skills;
INSERT INTO portfolio_skills (category, items, sort_order) VALUES
  ('Languages', ARRAY['TypeScript', 'JavaScript', 'Java', 'Python', 'C++', 'HTML/CSS'], 1),
  ('Frontend', ARRAY['React', 'Tailwind CSS', 'Vite'], 2),
  ('Tools', ARRAY['Git/GitHub', 'Docker'], 3);

-- Seed: Education
DELETE FROM portfolio_education;
INSERT INTO portfolio_education (degree, school, duration, description, sort_order) VALUES
  ('Bachelor''s in Computer Science', 'BITS Pilani', 'Aug 2025 - Jul 2029', 'Pursuing a CS degree with focus on practical software development, algorithms, and modern technologies.', 1),
  ('12th Grade (PCM)', 'Luthra Higher Secondary School', 'Completed 2025', 'Completed higher secondary education with Science stream, building foundation in Mathematics and Physics.', 2),
  ('10th Grade', 'Crescent Public School', 'Completed 2023', '96.8% - Outstanding Academic Performance', 3);

-- Experience table (run if upgrading)
CREATE TABLE IF NOT EXISTS portfolio_experience (
  id          SERIAL PRIMARY KEY,
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  duration    TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order  INT DEFAULT 0
);

ALTER TABLE portfolio_experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read experience" ON portfolio_experience;
CREATE POLICY "public read experience" ON portfolio_experience FOR SELECT USING (true);

-- Seed: Experience
DELETE FROM portfolio_experience;
INSERT INTO portfolio_experience (company, role, duration, description, sort_order) VALUES
  ('Metacognition', 'Engineering Intern', '2025 – Present', 'Engineering side at getmetacognition.com — shipped Engram, an FPA that gives AI agents episodic memory. Full-stack across frontend, backend, and product features.', 1),
  ('Metacognition', 'DevRel (prev.)', '2025', 'Developer relations before moving to engineering — community, docs, and getting builders hooked on memory-native AI.', 2);

-- Seed: Projects
DELETE FROM portfolio_projects;
INSERT INTO portfolio_projects (slug, name, description, stack, github_url, demo_url, image_url, featured, sort_order) VALUES
  ('engram', 'Engram', 'Meeting memory FPA — AI dashboard for transcripts, action items, calendar sync, and episodic recall. Shipped at Metacognition.', ARRAY['TypeScript', 'React', 'AI'], 'https://github.com/m-tauqueer/meet-bot', 'https://engram.tauq.me', '/projects/engram.png', true, 1),
  ('staygrad', 'Staygrad', 'Student platform to discover, compare, and book verified hostels & PGs near coaching hubs in Kota.', ARRAY['JavaScript', 'React'], 'https://github.com/m-tauqueer/staygrad', 'https://www.staygrad.in', '/projects/staygrad.png', true, 2),
  ('shell', 'CodeCrafters Shell', 'POSIX-compliant Unix shell built in Java — builtins, pipes, redirections, and process control.', ARRAY['Java'], 'https://github.com/m-tauqueer/codecrafters-shell-java', '', '', true, 3),
  ('tracker', 'Crypto Price Tracker', 'A web application that displays real-time cryptocurrency prices with interactive charts and price history for top 10 cryptocurrencies.', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://github.com/m-tauqueer/tracker', '', '', false, 4),
  ('survivals-edge', 'Survivals Edge', 'A voxel-based survival island created during a hackathon with custom terrain, trees, and a house.', ARRAY['GDScript', 'Godot'], 'https://github.com/m-tauqueer/Survivals_edge', '', '', false, 5);
