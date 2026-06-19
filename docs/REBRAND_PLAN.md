# Cyberpunk Rebrand — Phased Implementation Plan

**Identity:** Corpo Architect × Netrunner — engineer who ships at scale  
**Entry:** Glitch identity cinematic intro → portfolio  
**Motion:** Aggressive (with `prefers-reduced-motion` escape hatches)  
**Hero message:** Engineer-first (Metacognition, Engram, Scaler × BITS, stack)

---

## Phase 1 — Foundation & Intro ✅ *complete*

**Goal:** Lock design tokens, typography, and the cinematic entry experience.

| Task | Files |
|------|-------|
| Design tokens (deeper void, HUD cyan, display font vars) | `src/index.css`, `src/styles/tokens.css` |
| Orbitron + JetBrains fonts | `index.html` |
| Glitch identity intro (3–5s, skippable) | `src/components/intro/IntroSequence.tsx`, `src/styles/intro.css` |
| Wire intro → GUI landing | `src/pages/PortfolioPage.tsx` |
| Reduced-motion + session skip | `src/hooks/useIntroGate.ts` |

**Done when:** First visit plays intro → fades to hero GUI. Skip works. Repeat visits skip intro. Build passes.

**Dependencies added:** none

---

## Phase 2 — 3D Background Layer ✅ *complete*

**Goal:** Living particle/wireframe scene behind the hero — architect HUD depth.

| Task | Files |
|------|-------|
| Install `three`, `@react-three/fiber`, `@react-three/drei`, `postprocessing` | `package.json` |
| Lazy-loaded `CyberScene` component | `src/components/three/CyberScene.tsx` |
| Orange/cyan particle grid + subtle bloom | shaders / postprocessing |
| Mobile parity (lower particle count) | scene config by viewport |
| Replace static `CyberBackground` blobs | `CyberBackground.tsx` |

**Done when:** Hero has animated 3D backdrop. No jank on scroll. Lazy-load after intro completes.

**Dependencies added:** three, @react-three/fiber, @react-three/drei, @react-three/postprocessing

---

## Phase 3 — Hero Rewrite & GSAP Scroll ✅ *complete*

**Goal:** Engineer-first hero with choreographed reveals.

| Task | Files |
|------|-------|
| Install `gsap`, `@gsap/react` | `package.json` |
| Redesign `WhoAmISection` — title, proof line, stack HUD | `WhoAmISection.tsx`, `sections.css` |
| GSAP scroll triggers for section entrances | section components |
| Orbitron display headings site-wide | `SectionHeading.tsx`, nav |

**Done when:** Hero reads "Software Engineer" first, proof lines animate in, scroll sections choreographed.

**Dependencies added:** gsap, @gsap/react

---

## Phase 4 — Full UI Pass ✅ *complete*

**Goal:** Every surface matches corpo-netrunner system.

| Task | Areas |
|------|-------|
| Nav + mobile dock HUD chrome | `TerminalNav.tsx`, `sections.css` |
| Terminal restyle (green output only, glass chrome) | `terminal.css`, `BootSequence.tsx` |
| Journey timeline HUD panels | `JourneySection.tsx` |
| Projects cards (already started — align to new tokens) | `ProjectCard*.tsx` |
| Contact section | `ContactSection.tsx` |
| Boot sequence copy refresh | `BootSequence.tsx` |
| Admin page token alignment | `AdminPage.tsx` |

**Done when:** Visual consistency across all routes/sections. No orphaned old-orange-only patterns.

---

## Phase 5 — Aggressive FX & Polish ✅ *complete*

**Goal:** Site feels alive; performance holds.

| Task | Notes |
|------|-------|
| Global scanline / noise intensity pass | `cyber.css`, `NoiseOverlay.tsx` |
| Chromatic glitch on key moments (intro, hover, nav) | `cyber.css` |
| Border glitch system unified | remove duplicates |
| `prefers-reduced-motion` audit | all animated components |
| Bundle split — Three.js lazy, GSAP tree-shaken | `vite.config.ts` |
| Lighthouse / mobile perf pass | particle caps, will-change audit |

**Done when:** Aggressive on desktop, stable on mobile, reduced-motion respected everywhere.

---

## Phase 6 — Content & Deploy ⏳ *next*

| Task | Notes |
|------|-------|
| Hero copy final pass | `fallback.json`, Supabase seed |
| OG meta / title update | `index.html` |
| `npm run seed` for production data | Supabase |
| Deploy to Vercel + DNS `tauq.me` | user action |

---

## Design Tokens (reference)

```css
--bg-void: #040308;
--bg-deep: #0a0812;
--accent-orange: #ff6b1a;   /* CTAs, power */
--accent-cyan: #22d3ee;     /* HUD, links */
--term-green: #39ff88;      /* terminal output ONLY */
--accent-magenta: #e879f9;  /* glitch split only */
--font-display: 'Orbitron', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

---

## Rules

1. **One phase at a time** — merge & verify before next phase.
2. **No scope creep** — if it belongs to Phase N+1, note it and defer.
3. **Build must pass** after every phase.
4. **Mobile parity** unless a phase explicitly says otherwise.
