# Phase 2: Onboarding Flow - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can navigate from the landing page to a story universe and trigger the selfie upload flow, experiencing the cinematic aesthetic from first pixel. This phase delivers all visible onboarding screens: landing hero, universe selection with genre filtering, and the selfie upload modal (triggered post-chapter-1, not on launch).

</domain>

<decisions>
## Implementation Decisions

### Landing Page Visual
- Background: CSS gradient (`#0D0B12` → `#1A0A1E`) with inline SVG silhouette characters positioned absolute — no external image dependency
- Silhouettes: Inline SVG (not PNG assets) — scales perfectly, no network request
- CTA button: Rose-accent filled pill (`bg-rose-accent text-base`) with Framer Motion hover scale
- Hero animation: Framer Motion fade-in-up on mount — tagline fades in first, headline second, CTA third (stagger sequence)

### Universe Selection
- Genre tab active state: Rose-accent underline + `text-text-primary`; inactive = `text-muted`
- Universe card art: Gradient placeholder per genre (rose→purple for romance) with title overlay — no external image dependency
- Coming-soon cards: `grayscale opacity-50` CSS filter on card + `Lock` icon from lucide-react centered overlay + "Notify me" label
- Card stagger animation: `staggerChildren: 0.08`, `opacity: 0, y: 24` → `opacity: 1, y: 0`, triggered on mount

### Selfie Upload Flow
- Trigger: Modal overlay, triggered from Zustand store flag (`showSelfiePrompt`) set after chapter 1 completes — NOT a route, NOT on first launch
- Primer screen copy: "Make the story yours" headline + "Your photo stays on your device — it's never uploaded or shared" + skip CTA "Use an illustrated avatar instead"
- Crop library: `react-easy-crop` at `4:5` aspect ratio; file input uses `capture="user"` for direct front camera on mobile
- Compression: Canvas `drawImage` → `toDataURL('image/jpeg', 0.8)` resized to 256×256 before storing in Zustand (`setSelfie`)

### Claude's Discretion
- Exact SVG silhouette artwork (shape and pose of characters)
- Exact gradient stops for universe card backgrounds per genre
- Framer Motion easing curves (standard spring defaults acceptable)
- Modal backdrop and dismiss behaviour

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useChaptrStore` — `setSelfie(url)`, `showSelfiePrompt` flag (needs adding), `storyState` for chapter completion detection
- Tailwind tokens: `bg-base`, `bg-surface`, `text-text-primary`, `text-muted`, `text-rose-accent`, `bg-rose-accent`, `bg-purple-accent`, `text-gold`
- `.page-container` — max-width 1440px, margin auto
- `src/pages/LandingPage.tsx`, `src/pages/UniversesPage.tsx` — placeholder files to replace

### Established Patterns
- Framer Motion is in use (installed in Phase 1 dependencies)
- All page content uses `.page-container px-5` pattern
- `min-h-screen bg-base` on outermost div
- All router imports from `'react-router'`

### Integration Points
- `src/pages/LandingPage.tsx` — replace placeholder with real hero
- `src/pages/UniversesPage.tsx` — replace placeholder with genre tabs + cards
- `src/store/useChaptrStore.ts` — add `showSelfiePrompt: boolean` field + `triggerSelfiePrompt()` action
- New: `src/components/SelfieUploadModal.tsx` — modal overlay, mounted in router root or App shell

</code_context>

<specifics>
## Specific Ideas

- Pencil design reference: Landing screen (AWrNu) shows "Your face. Your story." hero, rose-purple CTA, dark cinematic silhouettes in background
- Pencil design reference: Universe Selection (A1aog) shows genre tabs ALL/ROMANCE/HORROR/MYSTERY/ADVENTURE, full-colour active card, desaturated coming-soon cards
- Selfie upload timing: research confirms pre-permission primer screens increase grant rates 30–40%; asking after engagement (chapter 1) not at cold launch is the right pattern
- The skip CTA wording "Use an illustrated avatar instead" makes the skip feel like a downgrade, nudging toward photo upload without coercion

</specifics>

<deferred>
## Deferred Ideas

- Real image assets for universe cards — use gradient placeholders for PoC, real illustrated art is V2
- PWA camera API (beyond file input) — `capture="user"` on file input is sufficient for PoC
- Animated background particles or parallax on landing — not in scope, keep it clean

</deferred>
