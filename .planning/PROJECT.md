# Chaptr

## What This Is

Chaptr is a mobile-first AI interactive story app where users upload a selfie and become the visual protagonist of a branching narrative. Users pick a story universe (starting with K-pop romance), make choices that change the story, and accumulate a personalized "Your Story" timeline of key decisions. Monetised via a free-with-gems IAP model.

## Core Value

The reading experience — story text, choice moment, scene reveal — must feel cinematic and immersive on first load. If this isn't gripping on the first chapter, nothing else matters.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Foundation**
- [ ] React + Tailwind + Vite project scaffold with dark mode and mobile-first layout
- [ ] Global design system: color tokens (#0D0B12, #D4799A, #9B7EC8, #D4AF37), Space Grotesk font, page-container (max-width 1440px, margin auto)

**Onboarding**
- [ ] Landing page (Hero: "Your face. Your story.", CTA "Start Your Story", cinematic dark background with character silhouettes)
- [ ] Selfie upload flow (photo upload, face crop preview, "Use this photo" confirm, skip option, privacy-first framing)
- [ ] Story universe selection (genre filter tabs: ALL/ROMANCE/HORROR/MYSTERY/ADVENTURE, universe cards with cover, title, genre tag, 2-sentence premise; active = full colour, coming soon = desaturated + lock + "Notify me")

**Core Reading Loop**
- [ ] Story reader screen (full-width scene image, centered reading column max 680px, choice buttons at bottom, gem counter top-right, "Your Story" sidebar trigger, progress bar)
- [ ] Typewriter text animation on story text reveals (Framer Motion, characters appear sequentially)
- [ ] Choice mechanic (2–3 options per moment; premium/locked choice shows gem badge e.g. "✦ 10 gems"; chosen state highlights selected, dims others, shows continuation text)
- [ ] Scene loading state (shimmer background, angular spinner, skeleton text lines)

**Your Story Sidebar**
- [ ] Chapter timeline showing key decision moments (mobile: bottom sheet; desktop: left sidebar)
- [ ] Decisions logged as user makes choices through the story

**Desktop Layout**
- [ ] Responsive desktop web layout (1440px, sidebar chapter list on left, 680px reading column centered, full-width scene image)

**AI Story Engine**
- [ ] Claude API integration for branching story generation (context-aware, remembers prior choices)
- [ ] Single story universe: "The Seoul Transfer" (K-pop romance, original fictional characters only — no real celebrity likenesses)
- [ ] Story state persistence (choices, chapter progress, gem balance) via localStorage for PoC

**Gem System (UI only for PoC)**
- [ ] Gem counter displayed in reader nav
- [ ] Premium choice gate (locked choices show gem cost, blocked if insufficient gems)
- [ ] Hardcoded starting gem balance (no real IAP in PoC)

### Out of Scope

- Real IAP / payment processing — PoC uses hardcoded gem balance; real monetisation is V2
- Multiple story universes — ship one complete universe before expanding
- Real celebrity likenesses — all characters are original fictional characters (IP risk)
- User accounts / auth — PoC uses localStorage; Supabase auth is V2
- Mobile app (iOS/Android native) — web-first, mobile-responsive; native app is post-validation
- Social features (sharing, comments, leaderboards) — deferred to V2
- AI image generation for scene images — use illustrated placeholder images to reduce infra cost; real AI scenes are V2
- Admin / content management — hardcode story content for PoC

## Context

- **Design spec**: 8 Pencil screens designed (Landing, Selfie Upload, Story Universe, Story Reader, Your Story Sidebar, Choice Selected, Scene Loading, Desktop Web). These ARE the build reference — match them precisely.
- **Color palette**: Base #0D0B12, Rose accent #D4799A, Purple accent #9B7EC8, Gem gold #D4AF37
- **Typography**: Space Grotesk throughout
- **Target demographic**: 13–22 female, heavy Wattpad/TikTok users. Aesthetic = premium webtoon app, not a game.
- **Animation style**: Typewriter text reveals, staggered card entry, choice highlight transitions. Framer Motion. No decorative animations.
- **Story universe**: "The Seoul Transfer" — K-pop trainee romance. Original fictional characters only.
- **Market comparables**: Love and Deepspace (~$1B), Episode ($175M), Wattpad (90M users). Interactive fiction market $3.84B, 12% CAGR.
- **Validation verdict**: STOP for Nick personally (off-domain). Building as portfolio signal + exploration of AI narrative mechanics.

## Constraints

- **Tech stack**: React + Tailwind + Vite — no exceptions
- **Build tool**: Claude Code (terminal). Never Cursor, Bolt, Lovable, or v0.
- **Auth**: Skip in PoC. No Supabase yet. localStorage for all state.
- **AI**: Claude API (Haiku for story generation — cost-efficient). No image generation APIs.
- **Images**: Use static illustrated placeholder images for scene images. No AI image gen in PoC.
- **IP**: No real celebrity names, faces, or likenesses. All characters are fictional.
- **Mobile-first**: Build mobile layout first, desktop responsive second. No hardcoded desktop pixel offsets.
- **Container rule**: All page content in max-width 1440px container with margin auto (.page-container). Backgrounds full-width, content contained.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web-first (not native mobile app) | Faster iteration, no App Store friction, desktop audience reachable | — Pending |
| Text-first story engine (no AI image gen) | Reduces infra cost and complexity for PoC; visual style defined by static illustrated art | — Pending |
| Single story universe ("The Seoul Transfer") | Ship one complete, polished experience before expanding; prevents scope creep | — Pending |
| localStorage for PoC state (no Supabase) | Eliminates auth/DB complexity for validation phase | — Pending |
| Original fictional characters only | Avoids IP/defamation risk from real celebrity likenesses | ✓ Good |
| Claude Haiku for story generation | Cost-efficient for PoC; Sonnet upgrade path available for V2 | — Pending |
| Gems as hardcoded balance (no real IAP) | Tests the UX mechanic without payment infra; validates willingness to engage before building monetisation | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-27 after initialization*
