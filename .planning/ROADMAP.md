# Roadmap: Chaptr

## Overview

Five phases deliver a complete AI interactive story PoC. Foundation scaffolds the technical shell. Onboarding brings users from landing page to their first story universe. The core reading loop builds the cinematic reader experience with all choice mechanics, gem system, and sidebar. Static story content makes Chapter 1 fully playable end-to-end. The AI engine replaces static dialogue with Claude Haiku streaming, completing the product.

## Phases

- [x] **Phase 1: Foundation** - Project scaffold, design system, routing, and state store
- [x] **Phase 2: Onboarding Flow** - Landing page, universe selection, and selfie upload
- [ ] **Phase 3: Core Reading Loop** - Story reader, typewriter, choices, gems, sidebar, and desktop layout
- [ ] **Phase 4: Static Story Content** - Authored Chapter 1 wired to story state machine, fully playable
- [ ] **Phase 5: AI Story Engine** - Claude Haiku integration replacing static nodes with streamed prose

## Phase Details

### Phase 1: Foundation
**Goal**: A running Vite + React + Tailwind v3 app with the design system, routing skeleton, and Zustand store — no content yet, but every architectural decision locked in
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, DESK-02
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts without errors; app loads in browser on mobile viewport without horizontal scroll
  2. Color tokens (#0D0B12, #D4799A, #9B7EC8, #D4AF37) and Space Grotesk font are visibly applied to a test element
  3. All four routes (`/`, `/upload`, `/universes`, `/story/:chapterId`) render a placeholder without 404
  4. Zustand store initialises with `chaptr-v1` key visible in localStorage after first load
  5. `.page-container` constrains content to 1440px on a wide monitor while background spans full width
**Plans**: 2 plans

Plans:
- [x] 01-01: Scaffold — Vite + React + Tailwind v3 + design system + font
- [ ] 01-02: Routing + State — React Router v7 routes + Zustand persist store
**UI hint**: yes

### Phase 2: Onboarding Flow
**Goal**: Users can navigate from the landing page to a story universe and trigger the selfie upload flow, experiencing the cinematic aesthetic from first pixel
**Depends on**: Phase 1
**Requirements**: ONB-01, ONB-02, ONB-03, ONB-04, ONB-05, ONB-06, ONB-07, VIZ-03
**Success Criteria** (what must be TRUE):
  1. Landing page renders hero text, CTA, and cinematic silhouette background; tapping CTA routes to universe selection
  2. Universe selection shows genre tabs that filter cards; "The Seoul Transfer" card is full colour; coming-soon cards are desaturated with lock icon
  3. Universe cards entrance animation staggers in on mount (opacity + y-axis slide)
  4. Selfie upload prompt appears after Chapter 1 completion (not on first launch); primer screen shows before file dialog
  5. Uploaded photo is cropped at 4:5, compressed to 256×256 JPEG, and visible in localStorage as a compact base64 string (no raw full-size image)
**Plans**: 2 plans

Plans:
- [x] 02-01: Landing + Universe Selection — landing page, genre tabs, universe cards, stagger animation
- [x] 02-02: Selfie Upload Flow — primer screen, react-easy-crop, canvas compression, localStorage storage
**UI hint**: yes

### Phase 3: Core Reading Loop
**Goal**: The full reader experience is interactive — story text types in, choices appear, gems gate premium options, the sidebar logs decisions, and desktop layout works
**Depends on**: Phase 2
**Requirements**: READ-01, READ-02, READ-03, READ-04, READ-05, READ-06, READ-07, READ-08, READ-09, SIDE-01, SIDE-02, SIDE-03, GEM-01, GEM-02, GEM-03, VIZ-01, VIZ-02, DESK-01
**Success Criteria** (what must be TRUE):
  1. Story text reveals character-by-character; one tap completes it instantly; second tap advances the beat
  2. Choices appear only after text completes; selected choice highlights in rose gradient; unchosen choices dim to 30% opacity
  3. A gem-gated choice shows the gold gem badge; attempting it with insufficient gems slides up a Vaul bottom sheet (never a full-screen interrupt); the first gem-gated choice in a chapter is always free
  4. Gem counter in top-right reflects the correct balance after spending; balance survives a browser refresh
  5. "Your Story" sidebar opens as a bottom sheet on mobile and as a left panel on desktop; it shows logged decision entries
  6. On a 1440px viewport, the layout shows left sidebar + centered 680px column + full-width scene image
**Plans**: 3 plans

Plans:
- [x] 03-01: Reader Layout + Scene States — screen structure, progress bar, scene image, loading shimmer/spinner/skeleton, protagonist overlay (VIZ-01, VIZ-02)
- [x] 03-02: Typewriter + Choice Mechanic — typewriter hook, two-tap skip, choice rendering, selected/unchosen states, gem badge, locked gate bottom sheet
- [x] 03-03: Gem System + Your Story Sidebar — Zustand gem balance, deduction logic, Vaul sidebar (mobile bottom sheet + desktop panel), decision logging
**UI hint**: yes

### Phase 4: Static Story Content
**Goal**: Chapter 1 of "The Seoul Transfer" is fully authored and playable end-to-end using a static story state machine — no AI required, no dead ends
**Depends on**: Phase 3
**Requirements**: STORY-01, STORY-02, STORY-03, STORY-04
**Success Criteria** (what must be TRUE):
  1. A user can start at `/story/chapter-1` and play through to the chapter-end screen without hitting any undefined state
  2. The first choice appears within the first 300 words of text
  3. At least 3 choices branch and resolve, with each path delivering continuation prose
  4. `[Name]` placeholder renders the stored user name; protagonist physical description never appears in the prose
  5. All character and world names use NOVA Entertainment / VEIL / Jiwoo — zero real celebrity references
**Plans**: 2 plans

Plans:
- [ ] 04-01: Story State Machine — Zustand story graph types (DialogueNode, ChoiceNode, SceneTransitionNode, ChapterEndNode), node traversal logic, choice history accumulation
- [ ] 04-02: Chapter 1 Content — authored prose for all nodes and branches, wired to state machine, full playthrough verified

### Phase 5: AI Story Engine
**Goal**: Claude Haiku streams prose for every story beat; the static Chapter 1 graph becomes the seed prompt structure; choice history flows into every call for narrative continuity
**Depends on**: Phase 4
**Requirements**: AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, AI-07
**Success Criteria** (what must be TRUE):
  1. Story text for a new beat streams in progressively — first characters appear within ~2 seconds of a choice being made
  2. Choices made earlier in the chapter are reflected in AI-generated prose (the AI "remembers" them)
  3. The loading shimmer appears during AI generation and disappears when the first streamed chunk arrives
  4. Prohibited phrases ("her heart skipped a beat", "suddenly", "she couldn't help but") do not appear in generated output
  5. The model ID in code is `claude-haiku-4-5`; the old ID `claude-3-haiku-20240307` is not referenced anywhere
**Plans**: 2 plans

Plans:
- [ ] 05-01: Claude API Client — streaming SSE client with buffer guard, system prompt architecture (Character Bible + Story State Block + Prose Style Constraints + Chapter Brief), prohibited prose list
- [ ] 05-02: Story Engine Integration — replace static DialogueNodes with AI calls, inject choice history per call, wire streaming output to typewriter renderer

## Progress

**Execution Order:** 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Onboarding Flow | 0/2 | Not started | - |
| 3. Core Reading Loop | 2/3 | In Progress|  |
| 4. Static Story Content | 0/2 | Not started | - |
| 5. AI Story Engine | 0/2 | Not started | - |
