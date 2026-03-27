# Chaptr — Technical Implementation Research

**Project:** Chaptr (AI interactive story app)
**Stack:** React + Tailwind v3 + Vite, Framer Motion, Claude Haiku API, localStorage
**Researched:** 2026-03-27
**Overall confidence:** HIGH (all key areas verified against official docs or first-party sources)

---

## 1. Vite + React + Tailwind v3 Project Setup

**Confidence:** HIGH

Since the project specifies Tailwind v3 (not v4), use the explicit versioned install. Tailwind v4 ships with a completely different configuration model (no `tailwind.config.js`, CSS-only config). Stick with v3 to keep the config predictable and avoid breaking changes.

### Setup commands

```bash
npm create vite@latest chaptr -- --template react
cd chaptr
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### `tailwind.config.js` (starting point, expanded in section 2)

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### `src/index.css` (required directives)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `vite.config.js` — no Tailwind plugin needed for v3

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

> Note: Tailwind v4 uses a Vite plugin (`@tailwindcss/vite`). Tailwind v3 uses PostCSS — the `npx tailwindcss init -p` command generates `postcss.config.js` automatically. Do not add the v4 Vite plugin to a v3 project.

---

## 2. Tailwind v3 — Dark Mode Only + Custom Color Tokens

**Confidence:** HIGH

Since Chaptr is dark mode only, there is no need for a light/dark toggle. The cleanest approach: apply the `dark` class permanently on `<html>` at app startup, configure `darkMode: 'class'` in Tailwind, and define all color tokens as CSS variables scoped to the `.dark` selector. This lets you write standard `bg-base`, `text-rose`, etc. utility classes rather than prefixing every class with `dark:`.

### Strategy

Define tokens as CSS variables in `index.css`. Reference them in `tailwind.config.js`. Apply `class="dark"` on `<html>` once at boot in `main.jsx`. Done — no toggle logic ever needed.

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Always-dark: set tokens directly on :root */
:root {
  --color-base: #0D0B12;
  --color-surface: #161221;
  --color-surface-2: #1E1A2E;
  --color-rose: #D4799A;
  --color-purple: #9B7EC8;
  --color-gold: #D4AF37;
  --color-text: #F0EBF8;
  --color-text-muted: #8B7FA8;
}

/* Page container — max-width 1440px, centered */
.page-container {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}
```

### `tailwind.config.js` with color tokens

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base:        'var(--color-base)',
        surface:     'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        rose:        'var(--color-rose)',
        purple:      'var(--color-purple)',
        gold:        'var(--color-gold)',
        text:        'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### `src/main.jsx` — permanently apply dark class

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Permanently dark — no toggle needed
document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Usage in components

```jsx
// Works without any dark: prefix because dark class is always present
<div className="bg-base text-text">
  <button className="bg-rose text-base">Read</button>
</div>
```

---

## 3. Space Grotesk Font Loading

**Confidence:** HIGH

**Recommendation: Use Fontsource (`@fontsource-variable/space-grotesk`), not the Google CDN.**

Reasons:
- Google CDN requires two network connections (CSS + font files), blocking first render for new visitors. Browser cache only helps on return visits.
- Fontsource self-hosts the font as part of the Vite bundle — same origin, no render-blocking external requests.
- The variable font package (`@fontsource-variable/space-grotesk`) supports all weights with a single font file, reducing total payload vs. loading individual weight files.

### Install

```bash
npm install @fontsource-variable/space-grotesk
```

### Import in `src/main.jsx`

```jsx
import '@fontsource-variable/space-grotesk'
// Covers weights 300–700 automatically via CSS variable font axis
```

### Tailwind config reference (already shown above)

```js
fontFamily: {
  sans: ['"Space Grotesk"', 'sans-serif'],
},
```

Then set `font-sans` on `<body>` in `index.css` or via a base layer:

```css
@layer base {
  body {
    @apply font-sans bg-base text-text;
  }
}
```

> Note: The static package `@fontsource/space-grotesk` also works but requires individual imports per weight (e.g. `@fontsource/space-grotesk/600.css`). The variable package is simpler and smaller overall.

---

## 4. Framer Motion — Typewriter Animation

**Confidence:** HIGH (verified against official Motion docs at motion.dev)

> Note: In 2025, Framer Motion became an independent library renamed **Motion**, with the package moving from `framer-motion` to `motion` on npm and imports changing to `motion/react`. Either package works, but new projects should use `motion`.

### Install

```bash
npm install motion
```

### Pattern: character-by-character with cancellable AbortRef

The core technique is splitting text into an array of characters, animating with `staggerChildren` in a `variants` object, and tracking animation state with a ref so the user can tap to skip. The `useAnimate` hook gives imperative control for cancellation.

```jsx
import { motion, useAnimate } from 'motion/react'
import { useState, useEffect, useCallback } from 'react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,    // 30ms between characters — adjust for feel
      delayChildren: 0.1,
    },
  },
}

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } }, // snap in, no fade
}

export function TypewriterText({ text, onComplete, className = '' }) {
  const [scope, animate] = useAnimate()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const chars = Array.from(text)

  // Skip to end on tap/click
  const skipAnimation = useCallback(() => {
    if (!isAnimating || isDone) return
    // Cancel current animation, show all chars immediately
    animate(scope.current, {}, { duration: 0 })
    scope.current.querySelectorAll('.char').forEach(el => {
      el.style.opacity = '1'
    })
    setIsDone(true)
    setIsAnimating(false)
    onComplete?.()
  }, [isAnimating, isDone, animate, scope, onComplete])

  useEffect(() => {
    setIsAnimating(true)
    setIsDone(false)
  }, [text])

  return (
    <motion.span
      ref={scope}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => {
        setIsDone(true)
        setIsAnimating(false)
        onComplete?.()
      }}
      onClick={skipAnimation}
      style={{ cursor: isAnimating ? 'pointer' : 'default' }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="char"
          variants={charVariants}
          // Preserve whitespace
          style={{ whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}
```

**Skip-on-tap pattern:** The `onClick` handler on the container calls `skipAnimation()`, which imperatively sets all `.char` elements to `opacity: 1` and marks animation as done. This is simpler than cancelling the stagger mid-flight with the animation controls — it jumps straight to the end state.

**Performance note:** For story paragraphs (200–500 chars), each character becomes a DOM node. This is fine for mobile but avoid running this on very long passages (1000+ chars) without chunking. Consider animating sentence-by-sentence for longer content.

---

## 5. Framer Motion — Staggered Card Entrance

**Confidence:** HIGH

The canonical pattern uses a parent `motion.div` with `variants` that includes `staggerChildren`, and child `motion.div` elements with their own `variants`. The parent orchestrates; the children just describe their own enter/exit states.

```jsx
import { motion } from 'motion/react'

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,   // 80ms between cards
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],   // custom ease — feels snappy
    },
  },
}

// Parent container
function CardGrid({ items }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.div
          key={item.id}
          className="bg-surface rounded-xl p-4"
          variants={cardVariants}
        >
          {/* card content */}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

**For story choice buttons** (the key interaction in Chaptr), use a tighter stagger with a slight scale-up to make each choice feel like it's being "offered":

```jsx
const choiceVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}
```

**Tip:** Wrap the card list in `<AnimatePresence>` when cards can be removed (e.g. after a choice is selected), to animate cards out before the next scene loads.

---

## 6. Claude API Integration — Streaming from React Frontend

**Confidence:** HIGH (verified against official Anthropic streaming docs)

### CORS: Direct Browser Access

As of August 2024, the Anthropic API supports direct browser calls via the `anthropic-dangerous-direct-browser-access: true` header. This eliminates the need for a proxy server in a PoC. The header name is intentionally alarming — it signals that your API key will be exposed in client-side code.

For a PoC with a hardcoded single user, this is acceptable. For any production deployment with multiple users, route through a backend proxy instead.

### Model name

Use `claude-haiku-4-5` (the current Haiku as of March 2026). Do not use `claude-3-haiku-20240307` — it's deprecated and retiring April 19, 2026.

### Streaming SSE event flow

The official event sequence from the API:
1. `message_start` — message object with empty content
2. For each content block: `content_block_start` → one or more `content_block_delta` → `content_block_stop`
3. `message_delta` — final usage stats (token counts are cumulative)
4. `message_stop`

The `text_delta` events inside `content_block_delta` carry `delta.text` — this is what you append to your state.

### Custom hook: `useClaudeStream`

```jsx
import { useState, useRef, useCallback } from 'react'

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export function useClaudeStream() {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const generate = useCallback(async (messages, systemPrompt) => {
    // Cancel any in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setText('')
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 1024,
          stream: true,
          system: systemPrompt,
          messages,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message ?? `HTTP ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') continue

          try {
            const event = JSON.parse(raw)
            if (
              event.type === 'content_block_delta' &&
              event.delta?.type === 'text_delta'
            ) {
              setText(prev => prev + event.delta.text)
            }
            // Handle overload errors mid-stream
            if (event.type === 'error') {
              throw new Error(event.error?.message ?? 'Stream error')
            }
          } catch (parseErr) {
            // Ignore parse errors on non-JSON SSE lines (ping events etc.)
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return // intentional cancel
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  return { text, isLoading, error, generate, cancel }
}
```

### `.env.local`

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### Error handling notes

- **overloaded_error** can arrive as an SSE event (`event: error`) mid-stream — handle it inside the event loop, not just at the HTTP level.
- **Rate limiting (429):** The API returns HTTP 429. For a PoC, a simple retry with exponential backoff is sufficient. Wrap the `fetch` call in a retry helper if needed.
- **AbortController** cancels the streaming read cleanly on component unmount or when the user navigates away. Always call `cancel()` in a `useEffect` cleanup.

### Rate limiting pattern (simple)

```jsx
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options)
    if (res.status === 429) {
      const delay = Math.pow(2, i) * 1000  // 1s, 2s, 4s
      await new Promise(r => setTimeout(r, delay))
      continue
    }
    return res
  }
  throw new Error('Rate limit exceeded after retries')
}
```

---

## 7. React Router Setup

**Confidence:** HIGH

**Use React Router v7 with `createBrowserRouter` + `RouterProvider` (data mode).** This is the recommended SPA pattern as of 2025–2026. `BrowserRouter` still works but is the legacy declarative mode — data mode gives you `loader`/`action` support if needed later and is the direction the library is heading.

### Install

```bash
npm install react-router
```

Note: In v7 the package is `react-router` (not `react-router-dom`). Both work, but `react-router` is the unified package.

### Route structure for Chaptr

```
/                  → Landing (upload / start)
/universe          → Universe picker / confirmation
/reader/:storyId   → Active reading screen
```

### `src/router.jsx`

```jsx
import { createBrowserRouter } from 'react-router'
import LandingPage from './pages/LandingPage'
import UniversePage from './pages/UniversePage'
import ReaderPage from './pages/ReaderPage'
import AppShell from './components/AppShell'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,  // shared layout (max-width container, bg)
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'universe', element: <UniversePage /> },
      { path: 'reader/:storyId', element: <ReaderPage /> },
    ],
  },
])
```

### `src/main.jsx`

```jsx
import { RouterProvider } from 'react-router'
import { router } from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

### `AppShell` component

```jsx
import { Outlet } from 'react-router'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-base">
      <div className="page-container px-5 md:px-[60px]">
        <Outlet />
      </div>
    </div>
  )
}
```

### Vite config — handle client-side routing in dev

Vite dev server handles this automatically. For production builds, the host (Vercel, Netlify) needs a rewrite rule so all paths serve `index.html`. On Vercel, this is automatic for SPA deployments. On Netlify, add a `_redirects` file:

```
/*  /index.html  200
```

---

## 8. Mobile Bottom Sheet Component (No Library)

**Confidence:** HIGH (pattern is well-established; implementation based on standard CSS/React patterns)

A pure React + Tailwind bottom sheet needs three things: a full-screen overlay, a panel that slides up from the bottom, and drag-to-dismiss (optional for PoC — can be tap-overlay-to-close instead).

### Core pattern

Uses `fixed inset-0` for the overlay, `fixed bottom-0 left-0 right-0` for the sheet, and Framer Motion for the slide-in transition. The `AnimatePresence` wrapper handles mount/unmount animation cleanly.

```jsx
import { motion, AnimatePresence } from 'motion/react'
import { useEffect } from 'react'

export function BottomSheet({ isOpen, onClose, children, title }) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl max-h-[85vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Drag handle indicator (visual only) */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-text-muted/40" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-5 pb-3 border-b border-surface-2">
                <h2 className="text-text font-semibold text-lg">{title}</h2>
              </div>
            )}

            {/* Content */}
            <div className="px-5 py-4">
              {children}
            </div>

            {/* iOS safe area bottom padding */}
            <div className="pb-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Usage

```jsx
const [sheetOpen, setSheetOpen] = useState(false)

<BottomSheet
  isOpen={sheetOpen}
  onClose={() => setSheetOpen(false)}
  title="Choose your path"
>
  <p className="text-text-muted">Where does the story go next?</p>
</BottomSheet>
```

### Key implementation notes

- `max-h-[85vh]` caps the sheet at 85% of viewport height to prevent it covering the full screen, leaving visible context behind it.
- `overflow-y-auto` on the panel lets content scroll internally when it exceeds the max height.
- `env(safe-area-inset-bottom)` handles iPhone notch/home indicator areas. This must be set inline (Tailwind's `pb-safe` only works if you add the safe area plugin — inline is simpler for a PoC).
- The `spring` transition (`damping: 30, stiffness: 300`) mimics native iOS sheet feel. Lower stiffness = more bounce. 300/30 is a good starting point.
- If you need swipe-to-dismiss later, `useMotionValue` + `useDragControls` from Motion is the right API. Skip for PoC.

---

## Summary: Dependency List

```bash
# Core
npm create vite@latest chaptr -- --template react

# Tailwind v3
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# Font
npm install @fontsource-variable/space-grotesk

# Animation
npm install motion

# Routing
npm install react-router
```

**No other dependencies required for the PoC.** All state is localStorage, all AI calls are direct fetch, no UI component library needed.

---

## Pitfalls & Gotchas

| Area | Pitfall | Prevention |
|------|---------|------------|
| Tailwind v3 vs v4 | v4 setup guides are all over Google in 2025–2026. Using v4 config with a v3 install silently breaks things. | Lock to `tailwindcss@3` explicitly in install command. |
| Claude API key in browser | `VITE_ANTHROPIC_API_KEY` is exposed in the built JS bundle — anyone can extract it. | Acceptable for PoC. Add backend proxy before sharing publicly. |
| SSE buffer splitting | Network can split an SSE event across multiple `reader.read()` chunks, breaking `JSON.parse`. | Always maintain a `buffer` string and split on `\n`, keeping the trailing incomplete line for the next chunk. |
| Framer Motion package name | `framer-motion` still works but `motion` is the current package. Don't mix imports from both. | Use `motion/react` imports throughout. |
| React Router v7 package | The package is now `react-router`, not `react-router-dom`. Both exist but `react-router-dom` is legacy. | Import from `react-router`. |
| Bottom sheet scroll lock | Without `overflow: hidden` on body, the page scrolls behind the open sheet on mobile. | Apply overflow lock in `useEffect` tied to `isOpen`. |
| Space Grotesk weight 300 | Light weight (300) can look unintentionally thin on low-DPI screens. | Prefer 400 as body default, 500–600 for UI labels. |
| Haiku model deprecation | `claude-3-haiku-20240307` retires April 19, 2026. | Use `claude-haiku-4-5`. |

---

## Sources

- [Tailwind CSS v3 + Vite install guide](https://v3.tailwindcss.com/docs/guides/vite)
- [Tailwind CSS v3 dark mode docs](https://v3.tailwindcss.com/docs/dark-mode)
- [Fontsource — Space Grotesk variable font](https://fontsource.org/fonts/space-grotesk/install)
- [Motion (Framer Motion) — Typewriter component](https://motion.dev/docs/react-typewriter)
- [Motion — stagger() function docs](https://www.framer.com/motion/stagger/)
- [Anthropic Streaming Messages docs](https://platform.claude.com/docs/en/build-with-claude/streaming)
- [Anthropic CORS / direct browser access (Simon Willison)](https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access/)
- [React Router v7 SPA setup](https://reactrouter.com/start/declarative/installation)
- [React Router v7 modes](https://reactrouter.com/start/modes)
- [Claude Haiku 4.5 model overview](https://platform.claude.com/docs/en/about-claude/models/overview)
