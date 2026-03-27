# Phase 2: Onboarding Flow - Research

**Researched:** 2026-03-27
**Domain:** React UI (landing page, universe selection, selfie upload modal with image cropping)
**Confidence:** HIGH

## Summary

Phase 2 replaces three placeholder pages with production onboarding screens: a cinematic landing hero, a filterable universe selection grid, and a selfie upload modal with crop/compress. The technical surface is straightforward -- Framer Motion animations, Zustand store additions, react-easy-crop for image cropping, and Canvas API for compression. No backend calls, no auth, no external services.

The main risk is getting the selfie crop-to-compress pipeline right (canvas sizing, JPEG quality, base64 storage in localStorage). The second risk is ensuring framer-motion and lucide-react are installed as dependencies -- they are NOT currently in package.json despite the CONTEXT.md claiming Phase 1 installed them.

**Primary recommendation:** Install missing dependencies first (framer-motion, lucide-react, react-easy-crop), then build landing page, universe selection, and selfie modal as three sequential tasks. The selfie modal mounts globally in the router layout, triggered by Zustand flag.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Landing background: CSS gradient (#0D0B12 to #1A0A1E) with inline SVG silhouettes, no external image dependency
- CTA button: Rose-accent filled pill (bg-rose-accent text-base) with Framer Motion hover scale
- Hero animation: Framer Motion fade-in-up stagger sequence (tagline first, headline second, CTA third)
- Genre tab active state: Rose-accent underline + text-text-primary; inactive = text-muted
- Universe card art: Gradient placeholder per genre (rose to purple for romance) with title overlay
- Coming-soon cards: grayscale opacity-50 CSS filter + Lock icon from lucide-react + "Notify me" label
- Card stagger animation: staggerChildren 0.08, opacity 0 y 24 to opacity 1 y 0
- Selfie trigger: Zustand store flag (showSelfiePrompt) set after chapter 1 -- NOT a route, NOT on first launch
- Primer screen copy: "Make the story yours" + privacy assurance + skip CTA "Use an illustrated avatar instead"
- Crop library: react-easy-crop at 4:5 aspect ratio; file input uses capture="user"
- Compression: Canvas drawImage to toDataURL('image/jpeg', 0.8) resized to 256x256

### Claude's Discretion
- Exact SVG silhouette artwork (shape and pose of characters)
- Exact gradient stops for universe card backgrounds per genre
- Framer Motion easing curves (standard spring defaults acceptable)
- Modal backdrop and dismiss behaviour

### Deferred Ideas (OUT OF SCOPE)
- Real image assets for universe cards (gradient placeholders for PoC)
- PWA camera API beyond file input
- Animated background particles or parallax on landing
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ONB-01 | Landing page with hero text, CTA, cinematic background silhouettes | Framer Motion stagger variants, inline SVG, CSS gradient background |
| ONB-02 | Universe selection with genre filter tabs and universe cards | Zustand local state for active tab, filtered card rendering, responsive grid |
| ONB-03 | Active card full colour, coming-soon cards desaturated with lock icon | CSS grayscale + opacity-50 filter, lucide-react Lock icon overlay |
| ONB-04 | Selfie upload after chapter 1 (not at launch), native file input with capture="user" | Zustand showSelfiePrompt flag, file input accept="image/*" capture="user" |
| ONB-05 | Primer screen before file dialog with copy and skip CTA | Modal internal state machine (primer -> crop -> done) |
| ONB-06 | Selfie compressed to 256x256 JPEG 80% via canvas | Canvas drawImage resize + toDataURL('image/jpeg', 0.8) |
| ONB-07 | Face crop UI with react-easy-crop at 4:5 aspect, confirm + skip | react-easy-crop Cropper component, getCroppedImg helper |
| VIZ-03 | Staggered card entrance animations | Framer Motion variants with staggerChildren: 0.08 |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | 19.2.4 | UI framework | Already in project |
| react-router | 7.13.2 | Routing (useNavigate for CTA) | Already in project |
| zustand | 5.0.12 | State management (showSelfiePrompt, setSelfie) | Already in project |
| tailwindcss | 3.4.19 | Styling | Already in project |

### New Dependencies (must install)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.38.0 | Animations (hero stagger, card entrance, modal transitions) | Locked decision from Phase 1 context |
| lucide-react | 1.7.0 | Icons (Lock icon for coming-soon cards) | Locked decision in CONTEXT.md |
| react-easy-crop | 5.5.7 | Selfie face cropping at 4:5 aspect ratio | Locked decision in CONTEXT.md |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-easy-crop | react-image-crop | react-easy-crop has simpler API for mobile pinch-zoom; locked decision anyway |
| lucide-react | heroicons | lucide-react specified in UI-SPEC; more icon variety |

**Installation:**
```bash
npm install framer-motion lucide-react react-easy-crop
```

**Version verification:** All versions confirmed against npm registry on 2026-03-27. framer-motion 12.38.0, lucide-react 1.7.0, react-easy-crop 5.5.7.

## Architecture Patterns

### Project Structure (new/modified files)
```
src/
├── pages/
│   ├── LandingPage.tsx        # Replace placeholder with hero
│   └── UniversesPage.tsx      # Replace placeholder with genre tabs + cards
├── components/
│   └── SelfieUploadModal.tsx   # New: modal with primer -> crop flow
├── lib/
│   └── cropImage.ts            # New: getCroppedImg canvas helper
├── store/
│   └── useChaptrStore.ts       # Add showSelfiePrompt + triggerSelfiePrompt
└── main.tsx                    # Mount SelfieUploadModal at router root level
```

### Pattern 1: Framer Motion Stagger Container
**What:** Parent variant with staggerChildren controls sequential child animation
**When to use:** Universe card entrance, hero text stagger
**Example:**
```typescript
// Framer Motion stagger pattern
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Usage
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {cards.map(card => (
    <motion.div key={card.id} variants={itemVariants}>
      {/* card content */}
    </motion.div>
  ))}
</motion.div>
```

### Pattern 2: Modal State Machine (Selfie Upload)
**What:** Internal state within the modal component drives which sub-view renders (primer, crop, or done)
**When to use:** Multi-step modals where each step has different UI
**Example:**
```typescript
type ModalStep = 'primer' | 'crop';

const [step, setStep] = useState<ModalStep>('primer');
const [imageSrc, setImageSrc] = useState<string | null>(null);

// Primer step: show copy + file input trigger
// Crop step: show react-easy-crop + confirm/retry buttons
```

### Pattern 3: Canvas Crop + Compress Helper
**What:** Isolated async function that takes an image source + crop area, returns compressed base64
**When to use:** After react-easy-crop's onCropComplete provides croppedAreaPixels
**Example:**
```typescript
// lib/cropImage.ts
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, 256, 256
  );

  return canvas.toDataURL('image/jpeg', 0.8);
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.crossOrigin = 'anonymous';
    img.src = url;
  });
}
```

### Pattern 4: Global Modal Mount
**What:** SelfieUploadModal renders at the router root level, controlled by Zustand store flag
**When to use:** Modals that can appear on any page (triggered by store state, not by route)
**Example:**
```typescript
// In main.tsx or a layout wrapper
const router = createBrowserRouter([
  {
    element: <AppShell />,  // layout wrapper that includes the modal
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/universes', element: <UniversesPage /> },
      { path: '/story/:chapterId', element: <StoryReaderPage /> },
    ],
  },
]);

// AppShell.tsx
function AppShell() {
  const showSelfiePrompt = useChaptrStore(s => s.showSelfiePrompt);
  return (
    <>
      <Outlet />
      {showSelfiePrompt && <SelfieUploadModal />}
    </>
  );
}
```

### Anti-Patterns to Avoid
- **Selfie modal as a route:** The selfie prompt is a modal overlay, not a `/upload` route. It must appear on top of whatever page the user is on after chapter 1.
- **Storing raw base64 without compression:** Raw phone photos can be 5-10MB as base64. Must compress to 256x256 JPEG first.
- **Triggering selfie on first launch:** CONTEXT.md explicitly states post-chapter-1 only. The `showSelfiePrompt` flag guards this.
- **Using external image assets for universe cards:** Gradient placeholders only in PoC. No network requests for card art.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image cropping UI | Custom drag-to-crop | react-easy-crop | Touch/pinch-zoom, aspect ratio locking, mobile support -- deceptively complex |
| Icon library | Custom SVG icons | lucide-react (Lock) | Consistent sizing, tree-shakeable, accessible |
| Animation orchestration | Custom CSS transitions with delays | Framer Motion variants | Stagger timing, mount/unmount animation, gesture support |

## Common Pitfalls

### Pitfall 1: Canvas CORS with FileReader
**What goes wrong:** Canvas `drawImage` throws security error if image source isn't loaded properly
**Why it happens:** When using `URL.createObjectURL` vs FileReader `readAsDataURL`, different browser security models apply
**How to avoid:** Use `FileReader.readAsDataURL()` to convert the File to a data URL before passing to react-easy-crop. Data URLs don't trigger CORS. Set `crossOrigin = 'anonymous'` on Image elements as a safety measure.
**Warning signs:** Canvas `toDataURL` throws "tainted canvas" error

### Pitfall 2: Base64 String Size in localStorage
**What goes wrong:** Storing uncompressed photos fills localStorage (5MB limit)
**Why it happens:** A 4MP phone photo as base64 can be 6-8MB
**How to avoid:** Always compress to 256x256 at 80% JPEG quality BEFORE storing. This produces ~10-30KB base64 strings, well within limits.
**Warning signs:** `QuotaExceededError` from localStorage

### Pitfall 3: File Input capture="user" on Desktop
**What goes wrong:** `capture="user"` does nothing on desktop browsers -- it just opens the normal file picker
**Why it happens:** `capture` attribute only affects mobile browsers with camera access
**How to avoid:** This is fine -- no special handling needed. On mobile it opens front camera, on desktop it opens file picker. Both work.
**Warning signs:** None -- this is expected behavior

### Pitfall 4: react-easy-crop Aspect Ratio
**What goes wrong:** Passing `aspect={4/5}` as a number works, but the crop area may not match expected portrait orientation
**Why it happens:** 4:5 is a portrait ratio (taller than wide), which is what we want for face photos
**How to avoid:** Use `aspect={4 / 5}` explicitly. The crop area will be portrait-oriented. This is correct for face cropping.
**Warning signs:** Crop area appears landscape when it should be portrait

### Pitfall 5: Zustand Store Schema Migration
**What goes wrong:** Adding `showSelfiePrompt` to the store breaks existing persisted state
**Why it happens:** The persist middleware loads cached state that doesn't include the new field
**How to avoid:** Bump `_schemaVersion` to 2, add migration from version 1 that sets `showSelfiePrompt: false` as default. Or rely on the fact that Zustand's persist middleware merges persisted state with defaults, so new fields get their initial values.
**Warning signs:** `showSelfiePrompt` is `undefined` instead of `false` after adding the field

### Pitfall 6: Router Layout Wrapper for Global Modal
**What goes wrong:** SelfieUploadModal can't be rendered globally if routes are flat (no layout route)
**Why it happens:** Current main.tsx has flat routes without a layout wrapper
**How to avoid:** Wrap routes in a layout route that renders `<Outlet />` + the modal. React Router v7 supports this via a parent route with no path (or path `/`) that wraps children.
**Warning signs:** Modal only appears on one specific page instead of globally

## Code Examples

### react-easy-crop Component Setup
```typescript
// Source: react-easy-crop npm docs + community patterns
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

function CropView({ imageSrc, onCropDone }: {
  imageSrc: string;
  onCropDone: (croppedAreaPixels: Area) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 320 }}>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={4 / 5}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>
  );
}
```

### File Input to Data URL
```typescript
function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setImageSrc(reader.result as string);
    setStep('crop');
  };
  reader.readAsDataURL(file);
}
```

### Framer Motion Modal Enter/Exit
```typescript
import { AnimatePresence, motion } from 'framer-motion';

// Backdrop
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
  className="fixed inset-0 bg-black/60 z-50"
  onClick={onClose}
/>

// Panel
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 20 }}
  transition={{ duration: 0.3 }}
  className="bg-surface rounded-2xl max-w-[440px] w-full p-8"
/>
```

### useNavigate for CTA Routing
```typescript
import { useNavigate } from 'react-router';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/universes')}>
      Start Your Story
    </button>
  );
}
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- needs setup in Wave 0 |
| Config file | none |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ONB-01 | Landing page renders hero text + CTA + background | unit (component render) | `npx vitest run src/__tests__/LandingPage.test.tsx -t "renders hero"` | No -- Wave 0 |
| ONB-02 | Universe selection renders genre tabs + cards | unit (component render) | `npx vitest run src/__tests__/UniversesPage.test.tsx -t "renders tabs"` | No -- Wave 0 |
| ONB-03 | Active card full color, coming-soon desaturated | unit (component render) | `npx vitest run src/__tests__/UniversesPage.test.tsx -t "coming soon"` | No -- Wave 0 |
| ONB-04 | Selfie prompt after chapter 1 only | unit (store logic) | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "selfie prompt"` | No -- Wave 0 |
| ONB-05 | Primer screen shows before file dialog | unit (component render) | `npx vitest run src/__tests__/SelfieUploadModal.test.tsx -t "primer"` | No -- Wave 0 |
| ONB-06 | Selfie compressed to 256x256 JPEG | unit (canvas helper) | `npx vitest run src/__tests__/cropImage.test.ts -t "compress"` | No -- Wave 0 |
| ONB-07 | Crop UI at 4:5 aspect ratio | unit (component render) | `npx vitest run src/__tests__/SelfieUploadModal.test.tsx -t "crop"` | No -- Wave 0 |
| VIZ-03 | Staggered card entrance animation | manual-only | Visual verification during dev | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Install vitest + @testing-library/react + @testing-library/jest-dom + jsdom as devDependencies
- [ ] Create `vitest.config.ts` with jsdom environment
- [ ] `src/__tests__/LandingPage.test.tsx` -- covers ONB-01
- [ ] `src/__tests__/UniversesPage.test.tsx` -- covers ONB-02, ONB-03, VIZ-03
- [ ] `src/__tests__/SelfieUploadModal.test.tsx` -- covers ONB-04, ONB-05, ONB-07
- [ ] `src/__tests__/cropImage.test.ts` -- covers ONB-06

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion v10 AnimatePresence | framer-motion v12 (same API, better perf) | 2025 | No API change, just faster |
| react-router-dom v6 | react-router v7 (import from 'react-router') | 2024 | useNavigate, Outlet, createBrowserRouter all from 'react-router' |
| Zustand v4 create() | Zustand v5 create()() (double-invoke for middleware) | 2024 | Already configured correctly in project |

## Open Questions

1. **Framer Motion not in package.json**
   - What we know: CONTEXT.md says "Framer Motion is in use (installed in Phase 1 dependencies)" but package.json does not list it and node_modules/framer-motion does not exist
   - What's unclear: Whether Phase 1 execution was supposed to install it and didn't, or if this was planned for Phase 2
   - Recommendation: Install framer-motion as the first task in Phase 2. No blocker.

2. **SelfieUploadModal mount point**
   - What we know: Current main.tsx has flat routes with no layout wrapper. The modal needs to render globally.
   - What's unclear: Whether to refactor main.tsx to use a layout route, or mount the modal directly in main.tsx
   - Recommendation: Use a layout route pattern (AppShell component) -- cleaner, supports future global UI elements (toast notifications, loading states). This is within Claude's discretion.

3. **Existing /upload route in FOUND-06**
   - What we know: FOUND-06 specifies routes including `/upload` (selfie). But CONTEXT.md locks the selfie as a modal overlay, not a route.
   - What's unclear: Whether the `/upload` route should still exist as a fallback
   - Recommendation: Do NOT create a `/upload` route. The selfie is a modal triggered by Zustand state. The CONTEXT.md decision supersedes the original route plan.

## Sources

### Primary (HIGH confidence)
- Project source code: package.json, main.tsx, useChaptrStore.ts, LandingPage.tsx, UniversesPage.tsx, tailwind.config.js, index.css -- all read directly
- npm registry: react-easy-crop@5.5.7, framer-motion@12.38.0, lucide-react@1.7.0 -- versions verified via `npm view`

### Secondary (MEDIUM confidence)
- [react-easy-crop npm docs](https://www.npmjs.com/package/react-easy-crop) -- API surface, Cropper props, onCropComplete callback
- [react-easy-crop GitHub](https://github.com/ValentinH/react-easy-crop) -- getCroppedImg helper pattern
- [Canvas crop/compress examples](https://dev.to/sukanta47/cropping-uploading-profile-pictures-in-react-with-typescript-and-react-easy-crop-5dl9) -- TypeScript patterns for canvas compression

### Tertiary (LOW confidence)
- None -- all findings verified against source code or npm registry

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified in npm registry, existing code read directly
- Architecture: HIGH -- patterns are well-established React/Framer Motion/Canvas patterns
- Pitfalls: HIGH -- canvas CORS, localStorage limits, capture attribute behavior are well-documented

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable libraries, no fast-moving changes expected)
