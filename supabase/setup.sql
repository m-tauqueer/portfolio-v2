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

-- Seed: Profile
INSERT INTO portfolio_profile (id, name, title, bio, location, email, resume_url, interests)
VALUES (
  1,
  'Mohammad Tauqueer',
  'Software Engineer',
  'Yo, I''m Tauqueer — a CS undergrad at Scaler & BITS Pilani, based in Bangalore. I build full-stack tools, mess with shells in Java, and ship stuff like Staygrad and meet-bot. When I''m not coding, you''ll find me behind a camera or hanging with OSC and Reinforce Club.',
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
  ('Bachelor''s in Computer Science', 'Scaler School of Technology', 'Aug 2025 - Jul 2029', 'Currently pursuing my primary CS degree with focus on practical software development, algorithms, and modern technologies.', 1),
  ('Bachelor''s in Computer Science', 'BITS Pilani', 'Aug 2025 - Jul 2029', 'Pursuing a parallel degree to strengthen my theoretical foundation and expand my academic credentials in computer science.', 2),
  ('12th Grade (PCM)', 'Luthra Higher Secondary School', 'Completed 2025', 'Completed higher secondary education with Science stream, building foundation in Mathematics and Physics.', 3),
  ('10th Grade', 'Crescent Public School', 'Completed 2023', '96.8% - Outstanding Academic Performance', 4);

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
  ('Company TBD', 'Software Engineering Intern', '2026', 'Building and shipping features across the stack. Details coming soon.', 1),
  ('Startup TBD', 'Developer Intern', '2025', 'Worked on product features and developer tooling. Details coming soon.', 2);

-- Seed: Projects
DELETE FROM portfolio_projects;
INSERT INTO portfolio_projects (slug, name, description, stack, github_url, demo_url, featured, sort_order) VALUES
  ('meet-bot', 'meet-bot', 'TypeScript meeting assistant — captures live audio, queues jobs, and processes transcripts with AI.', ARRAY['TypeScript'], 'https://github.com/m-tauqueer/meet-bot', '', true, 1),
  ('staygrad', 'Staygrad', 'Student-focused platform to discover, compare, and book verified hostels and PG accommodations.', ARRAY['JavaScript'], 'https://github.com/m-tauqueer/staygrad', '', true, 2),
  ('shell', 'CodeCrafters Shell', 'Building a Unix shell in Java (CodeCrafters challenge).', ARRAY['Java'], 'https://github.com/m-tauqueer/codecrafters-shell-java', '', true, 3),
  ('tracker', 'Crypto Price Tracker', 'A web application that displays real-time cryptocurrency prices with interactive charts and price history for top 10 cryptocurrencies.', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://github.com/m-tauqueer/tracker', '', false, 4),
  ('survivals-edge', 'Survivals Edge', 'A voxel-based survival island created during a hackathon with custom terrain, trees, and a house.', ARRAY['GDScript', 'Godot'], 'https://github.com/m-tauqueer/Survivals_edge', '', false, 5);
