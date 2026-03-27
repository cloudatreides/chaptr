# Phase 3: Core Reading Loop - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

The full reader experience is interactive — story text types in, choices appear, gems gate premium options, the sidebar logs decisions, and desktop layout works. This phase delivers all visible reader screen components: scene image, typewriter text reveal, two-tap skip, choice buttons (including gem-gated states), gem counter nav bar, Vaul bottom sheet for locked choices, "Your Story" sidebar (mobile bottom sheet + desktop panel), and the 3-column desktop layout at 1440px.

</domain>

<decisions>
## Implementation Decisions

### Reader Layout & Scene States
- Scene image: full-width at top of screen, fixed height 40vh — content scrolls below
- Progress bar: thin 2px rose-accent bar at very top (reading progress indicator)
- Loading shimmer: dark shimmer on bg-surface for text lines + angular spinner centered on scene image
- Protagonist overlay (VIZ-02): selfie thumbnail absolutely positioned on silhouette using mix-blend-mode: luminosity — only on chapter cover + completion screen (not every scene)

### Typewriter & Choice Mechanic
- Typewriter implementation: recursive `setTimeout` with `isCancelledRef` guard (React Strict Mode safe) — as per READ-02
- Two-tap skip: tap anywhere on the text area completes text instantly; second tap advances beat
- Choice layout: stacked vertical list below text, full-width buttons with subtle border
- Gem badge: inline gold pill on the right side of the locked choice button (not a corner overlay)

### Gem System & Your Story Sidebar
- Gem counter: top-right of reader nav bar, gold `✦` icon + number
- Gem-gate bottom sheet: Vaul with snapPoints [0.5, 1], slides up 50% — shows gem cost + "Get more gems" placeholder
- Sidebar on desktop: fixed left panel 280px wide, always visible at ≥1024px (lg:), shows "Your Story" heading + decision timeline
- Decision log entry: single line — `Ch.1 · [choice summary text]` with rose dot indicator

### Desktop Layout & Navigation
- Desktop sidebar breakpoint: `lg:` (1024px) — 3-column layout (280px sidebar + 680px column + remaining)
- Reading column max-width: 680px centered
- Reader nav bar: gem counter (top-right) + "Your Story" trigger button (top-left on mobile) + chapter title (center)

### Claude's Discretion
- Exact shimmer animation keyframes and timing
- Vaul backdrop opacity and transition
- Decision timeline entry hover/active states
- Gem bottom sheet visual design beyond copy

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useChaptrStore` — Zustand store with persist middleware; add gem balance (30 initial), decision log array, sidebar open state
- Tailwind tokens: `bg-base`, `bg-surface`, `text-text-primary`, `text-muted`, `text-rose-accent`, `bg-rose-accent`, `text-gold`, `.page-container`
- `AppShell.tsx` — layout wrapper with Outlet; extend to support desktop 3-column at lg:
- `src/pages/` — StoryPage.tsx placeholder exists from Phase 1 routing
- Framer Motion installed (Phase 2)
- lucide-react installed (Phase 2)

### Established Patterns
- All Zustand state in `useChaptrStore` with persist middleware (`chaptr-v1`, schema versioning)
- Framer Motion variants pattern (containerVariants + itemVariants) established in UniversesPage
- Tailwind responsive prefixes — `lg:` for desktop, `px-5` mobile padding
- react-router v7 imports from `'react-router'`
- Test files in `src/__tests__/`

### Integration Points
- `src/pages/StoryPage.tsx` — replace placeholder with full reader
- `src/store/useChaptrStore.ts` — add gemBalance (30), decisionLog [], sidebarOpen bool, spendGems(), logDecision(), toggleSidebar()
- New: `src/hooks/useTypewriter.ts` — recursive setTimeout implementation
- New: `src/components/reader/` — StoryReader, ChoiceList, GemCounter, YourStorySidebar, GemGateSheet
- Vaul package needs installing (`vaul` from npm)

</code_context>

<specifics>
## Specific Ideas

- READ-02 explicitly calls out recursive setTimeout (not setInterval) with isCancelledRef guard — this is a known React Strict Mode pitfall, plan must implement it exactly
- First gem-gated choice in each chapter is always free (READ-05) — Zustand tracks `firstGemChoiceUsed` per chapter
- Vaul bottom sheet never hides the locked choice text (READ-07) — slides up over content, not replace
- Desktop layout spec: left sidebar 280px + centered 680px reading column + full-width scene image at top (DESK-01)
- VIZ-01 calls for scene images with silhouette protagonist (face obscured/backlit) — use gradient placeholder art for PoC

</specifics>

<deferred>
## Deferred Ideas

- Real gem purchase flow (bottom sheet shows placeholder only for PoC)
- Animated scene transitions between beats
- Full mobile polish for sidebar (VaulDrawer snap behaviour on iOS Safari — PoC acceptable)

</deferred>
