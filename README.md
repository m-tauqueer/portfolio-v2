# Terminal Portfolio v2

Matrix-style interactive terminal portfolio for Mohammad Tauqueer.

## Stack

- React + Vite + TypeScript + Tailwind CSS
- Framer Motion
- Supabase (content database)
- Vercel (hosting + admin API routes)

## Local setup

```bash
cd ~/Desktop/portfolio-v2
cp .env.example .env   # fill in your keys
```

### 1. Create database tables

Open [Supabase SQL Editor](https://supabase.com/dashboard/project/kzdjowcfgalrijfoxsmi/sql/new) and run the contents of:

```
supabase/migrations/001_init.sql
```

### 2. Seed data

```bash
npm run seed
```

### 3. Run locally

**Terminal only (no admin API):**
```bash
npm run dev
```

**Full stack (terminal + /admin):**
```bash
npm run dev:full
```

Then open:
- Terminal: http://localhost:3000
- Admin: http://localhost:3000/admin

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | `https://kzdjowcfgalrijfoxsmi.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Publishable key (browser reads) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key (API writes only) |
| `ADMIN_PASSWORD` | Password for `/admin` login |

## Deploy to Vercel

1. Push repo to GitHub
2. Import project in Vercel
3. Add all 4 env vars
4. Deploy
5. Point `www.tauq.me` DNS to Vercel

## Terminal commands

`help`, `whoami`, `about`, `education`, `skills`, `projects`, `projects --all`, `project <slug>`, `contact`, `resume`, `social`, `neofetch`, `clear`, `history`

Easter eggs: `sudo`, `vim`, `rm -rf`, `cowsay`, `fortune`

## Security

- Never commit `.env`
- Rotate secret key if exposed
- Use a strong `ADMIN_PASSWORD` in production
