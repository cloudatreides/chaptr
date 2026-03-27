# Requirements: Chaptr

**Defined:** 2026-03-27
**Core Value:** The reading experience — story text, choice moment, scene reveal — must feel cinematic and immersive on first load.

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: Vite + React + Tailwind v3 project scaffold (locked to tailwindcss@3, not v4)
- [ ] **FOUND-02**: Global design system: CSS variable color tokens (#0D0B12, #D4799A, #9B7EC8, #D4AF37) configured in tailwind.config.js + applied via class names
- [ ] **FOUND-03**: Space Grotesk font loaded via @fontsource-variable/space-grotesk (self-hosted, not Google CDN)
- [ ] **FOUND-04**: Dark mode only — `class="dark"` applied permanently to `<html>` at boot, no toggle
- [ ] **FOUND-05**: Global `.page-container` class (max-width 1440px, margin auto) applied to all page content; backgrounds remain full-width
- [ ] **FOUND-06**: React Router v7 (`createBrowserRouter` + `RouterProvider`) with routes: `/` (landing), `/upload` (selfie), `/universes` (selection), `/story/:chapterId` (reader)
- [ ] **FOUND-07**: Zustand store with localStorage persistence via `persist` middleware; single key `chaptr-v1`; versioned migrations

### Onboarding

- [ ] **ONB-01**: Landing page renders with hero text "Your face. Your story.", single CTA "Start Your Story", dark cinematic background with character silhouettes
- [ ] **ONB-02**: Story universe selection screen with genre filter tabs (ALL / ROMANCE / HORROR / MYSTERY / ADVENTURE) and universe cards (cover image, title, genre tag, 2-sentence premise)
- [ ] **ONB-03**: Active universe card ("The Seoul Transfer") renders full colour; coming-soon cards render desaturated with lock icon + "Notify me" label
- [ ] **ONB-04**: Selfie upload prompt shown AFTER chapter 1 completes (not at launch) — uses native file input with `capture="user"` for direct front-camera access on mobile
- [ ] **ONB-05**: Selfie onboarding framing: custom primer screen shown before browser file dialog with copy "Make the story yours" (not a permission ask); includes skip CTA "Use an illustrated avatar instead"
- [ ] **ONB-06**: Selfie image compressed to 256×256 JPEG at 80% quality via canvas before storing in localStorage (never stored as raw base64)
- [ ] **ONB-07**: Face crop UI using `react-easy-crop` at 4:5 aspect ratio; includes "Use this photo" confirm and skip option

### Story Reader

- [ ] **READ-01**: Story reader screen renders full-width scene image at top, centered reading column (max-width 680px), choice buttons stacked at bottom, gem counter top-right, "Your Story" sidebar trigger
- [ ] **READ-02**: Typewriter text animation on all story text reveals — characters appear sequentially using `staggerChildren: 0.03` Framer Motion variant; implemented via recursive `setTimeout` (not `setInterval`) with `isCancelledRef` guard for React Strict Mode
- [ ] **READ-03**: Two-tap skip behaviour — first tap completes text instantly; second tap advances to next beat
- [ ] **READ-04**: Choices never appear until typewriter animation completes (or is skipped)
- [ ] **READ-05**: Choice mechanic renders 2–3 options per beat; premium/locked choice shows gem badge (e.g. "✦ 10 gems") in warm gold; first gem-gated choice in each chapter is always free
- [ ] **READ-06**: Chosen choice renders highlighted (rose gradient); unchosen choices render at 30% opacity; continuation story text fades in below
- [ ] **READ-07**: Locked choice gate: if gems insufficient, slide-up bottom sheet appears (not full-screen nav interrupt) offering gem options; never fully hides the locked choice text
- [ ] **READ-08**: Scene loading state renders shimmer background, angular spinner, and skeleton text lines during AI generation
- [ ] **READ-09**: Progress bar renders at top of reader indicating chapter completion percentage

### Your Story Sidebar

- [ ] **SIDE-01**: "Your Story" sidebar renders as bottom sheet on mobile (Vaul, snapPoints [0.5, 1]) and as left sidebar on desktop
- [ ] **SIDE-02**: Sidebar displays chapter timeline with key decision moments logged as user makes choices
- [ ] **SIDE-03**: Each timeline entry shows chapter number, decision summary, and the option chosen

### Gem System

- [ ] **GEM-01**: Gem counter displayed in reader top-right nav, initialised at 30 gems from Zustand store
- [ ] **GEM-02**: Spending a gem on a premium choice deducts the cost from the Zustand gem balance
- [ ] **GEM-03**: Gem balance persists in localStorage across sessions

### Story Content — "The Seoul Transfer"

- [ ] **STORY-01**: Static story graph for Chapter 1 of "The Seoul Transfer" — trainee life framing, enemies-to-lovers with lead Jiwoo (NOVA Entertainment, group: VEIL); first choice within first 300 words; 3–5 choices total; chapter ends on emotional hook
- [ ] **STORY-02**: Story text written in second-person present tense ("You step into the practice room"); `[Name]` placeholder renders the user's name; protagonist physical description never locked in prose
- [ ] **STORY-03**: Original fictional world only: agency name NOVA Entertainment, group name VEIL; zero real celebrity names or likenesses
- [ ] **STORY-04**: At minimum, Chapter 1 fully playable end-to-end with static content before AI integration

### AI Story Engine

- [ ] **AI-01**: Claude API integration using `claude-haiku-4-5` model (NOT `claude-3-haiku-20240307` which retires April 19, 2026)
- [ ] **AI-02**: Direct browser API calls via `anthropic-dangerous-direct-browser-access: true` header (acceptable for PoC)
- [ ] **AI-03**: System prompt architecture: Character Bible (static) + Story State Block (dynamic, injected per call) + Prose Style Constraints + Chapter Brief
- [ ] **AI-04**: App manages all story state; Claude generates prose only — never ask Claude to decide gem gates or choice outcomes
- [ ] **AI-05**: Streaming response rendered progressively via SSE; buffer maintained across `reader.read()` chunks to prevent JSON parse errors on split events
- [ ] **AI-06**: Story choices made by user stored in Zustand and injected into every subsequent Claude system prompt for narrative continuity
- [ ] **AI-07**: Prohibited prose list enforced in system prompt (ban: "her heart skipped a beat", "suddenly", "she couldn't help but")

### Protagonist Visuals

- [ ] **VIZ-01**: Scene images use static illustrated artwork with silhouette protagonist (face deliberately obscured / backlit)
- [ ] **VIZ-02**: If selfie uploaded: user photo thumbnail rendered via CSS `position: absolute` overlay on protagonist silhouette with `mix-blend-mode: luminosity`; displayed at emotionally salient moments (chapter cover, completion screen) — not every scene
- [ ] **VIZ-03**: Staggered card entrance animations on universe cards (Framer Motion, `staggerChildren: 0.08`, `opacity: 0, y: 24` → `opacity: 1, y: 0`)

### Desktop Layout

- [ ] **DESK-01**: Desktop web layout (1440px) with left sidebar chapter list, centered 680px reading column, full-width scene image
- [ ] **DESK-02**: All layout uses Tailwind responsive prefixes (`flex-col md:flex-row`, `px-5 md:px-[60px]`); no hardcoded desktop pixel offsets

## v2 Requirements

### Monetisation

- **MON-01**: Real IAP gem bundles ($1.99 / $4.99 / $14.99 / $49.99 tiers)
- **MON-02**: Watch-an-ad-for-gems flow (rewarded ads to reduce purchase pressure)
- **MON-03**: Daily gem earning (3 gems/day via dailies/quests)

### Accounts & Backend

- **ACCT-01**: User accounts via Supabase Auth
- **ACCT-02**: Story state synced to Supabase (persists across devices)
- **ACCT-03**: User profile with display name and avatar

### Content Expansion

- **CONT-01**: Additional story universes (horror, mystery, fantasy romance)
- **CONT-02**: Chapters 2–6 of "The Seoul Transfer" with second lead and love triangle
- **CONT-03**: Chapter 6 "boss choice" engineered as screenshot/reaction moment
- **CONT-04**: Three distinct endings

### Social & Virality

- **SOCL-01**: Share "My Story" summary card (TikTok-optimised)
- **SOCL-02**: "What did you choose?" comparison screen

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real IAP / payment processing | PoC validates UX mechanic with hardcoded gems; real monetisation is V2 |
| Native iOS/Android app | Web-first; App Store submission adds months of friction |
| AI image generation for scenes | Infra cost and complexity; static illustrated art is the PoC approach |
| Multiple story universes (v1) | Ship one polished universe before expanding |
| Real celebrity names or likenesses | IP and defamation risk — all characters are fictional |
| User accounts / Supabase auth | localStorage is sufficient for PoC validation |
| Social features (sharing, comments) | Deferred to V2 |
| Admin / CMS | Story content hardcoded for PoC |
| Light mode | Dark-only; no toggle needed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| FOUND-07 | Phase 1 | Pending |
| ONB-01 | Phase 2 | Pending |
| ONB-02 | Phase 2 | Pending |
| ONB-03 | Phase 2 | Pending |
| ONB-04 | Phase 2 | Pending |
| ONB-05 | Phase 2 | Pending |
| ONB-06 | Phase 2 | Pending |
| ONB-07 | Phase 2 | Pending |
| READ-01 | Phase 3 | Pending |
| READ-02 | Phase 3 | Pending |
| READ-03 | Phase 3 | Pending |
| READ-04 | Phase 3 | Pending |
| READ-05 | Phase 3 | Pending |
| READ-06 | Phase 3 | Pending |
| READ-07 | Phase 3 | Pending |
| READ-08 | Phase 3 | Pending |
| READ-09 | Phase 3 | Pending |
| SIDE-01 | Phase 3 | Pending |
| SIDE-02 | Phase 3 | Pending |
| SIDE-03 | Phase 3 | Pending |
| GEM-01 | Phase 3 | Pending |
| GEM-02 | Phase 3 | Pending |
| GEM-03 | Phase 3 | Pending |
| VIZ-01 | Phase 3 | Pending |
| VIZ-02 | Phase 3 | Pending |
| VIZ-03 | Phase 2 | Pending |
| STORY-01 | Phase 4 | Pending |
| STORY-02 | Phase 4 | Pending |
| STORY-03 | Phase 4 | Pending |
| STORY-04 | Phase 4 | Pending |
| AI-01 | Phase 5 | Pending |
| AI-02 | Phase 5 | Pending |
| AI-03 | Phase 5 | Pending |
| AI-04 | Phase 5 | Pending |
| AI-05 | Phase 5 | Pending |
| AI-06 | Phase 5 | Pending |
| AI-07 | Phase 5 | Pending |
| DESK-01 | Phase 3 | Pending |
| DESK-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-27*
*Last updated: 2026-03-27 after initial definition*
