# Chaptr Research: Gem Economy + Selfie Onboarding UX

**Researched:** 2026-03-27
**Confidence:** MEDIUM (gem pricing from community sources + official writer docs; UX from NN/g + Appcues research; implementation patterns from direct library docs)

---

## 1. Gem Economy Mechanics (Episode, Choices, Deepspace)

### How These Apps Structure Their Currency

**Episode (Pocket Gems)**
- Two resources: **Gems** (premium, paid/earned) + **Passes** (timer-gated reads)
- Gems are spent on story choices, outfit customization, and bonus scenes
- Typical gem choice costs: **2–29 gems**, with the range validated by Episode's own writer portal
  - Low-value bonus: 2–10 gems (e.g. a bonus conversation line, a slightly better outfit)
  - Mid-tier choice: 12–18 gems (e.g. unlock a kissing scene, see events from another character's POV)
  - High-value unlock: 20–29 gems (exclusive romantic scene, major story branch)
- The **first gem choice in every community story is free** — this is a deliberate sample strategy to build trust before the paywall hits
- Gem bundle pricing (App Store, estimated from community reports):
  - Starter: $1.99 (small pack, no discount — intentionally bad value to anchor perception)
  - Small: $4.99
  - Medium: $9.99
  - Large: $19.99
  - XL: $49.99 or $74.99 (seasonal/whale tier)
- The small pack being a bestseller despite being the worst value is a documented pattern — impulse buyers are the largest segment by transaction count, not revenue

**Choices: Stories You Play (Pixelberry)**
- Two resources: **Diamonds** (premium) + **Keys** (chapter tickets)
- Diamond pack tiers: $1.99 → $4.99 → $9.99 → $19.99 → $49.99 → $99.99
- $1.99 pack is their documented bestseller despite worst value-per-diamond
- Keys and diamonds serve different purposes — keys gate reading, diamonds gate choices/outfits
- No classic soft/hard currency split: both are real-money purchase only (no earn-for-free baseline)

**Love and Deepspace (Infold Games)**
- Two layers: **Crystals** (real money only) → **Diamonds** (spendable in-game)
- Crystal packs are tiered with "first purchase bonus" multipliers (e.g. 2x diamonds on first top-up per tier)
- Multi-tier top-up gift resets as a live event mechanic — whales are re-incentivized quarterly
- Focus is cosmetic (character outfits, accessories) + gacha pulls; less about story gating
- Revenue: $500M+ globally by March 2025. Monetization philosophy: emotional attachment to characters drives willingness to spend

### Earning Gems for Free (Episode)

| Method | Gems Earned | Friction |
|--------|-------------|----------|
| Daily login bonus | 1–3 gems | Low |
| Complete quests (found on Home > Quests tab) | 3–10 gems | Medium |
| Mini-games after episodes | ~1 gem per game | Low |
| Story completion streaks | Varies | Low |
| Watch rewarded ads | 1–3 gems | Low |

**Key insight:** Free gem earning is deliberately slow. A single locked choice costs 12–29 gems. A player earning 3 gems/day hits the first real paywall after ~4 sessions. This is intentional pacing — enough free play to get hooked, then friction to monetize.

### Recommendation for Chaptr PoC

For PoC: hardcode 30 gems starting balance. Set premium choices at 10 gems. This gives the player exactly 3 premium choices before they would need to earn/buy more. That's enough to feel the mechanic without needing real IAP. Keep a "how to earn more" UI pointing at "coming soon" to seed the mental model early.

For V1 IAP tier structure, use:
- $1.99 → 15 gems (starter, worst value — impulse tier)
- $4.99 → 50 gems (most popular expected)
- $14.99 → 175 gems (best value framing)
- $49.99 → 700 gems (whale tier)

---

## 2. Premium Choice Gate UX Patterns

### How Locked Choices Are Shown

**Standard pattern across Episode / Choices:**
- The locked option appears inline with free choices — same visual weight, not hidden
- A gem icon (usually a diamond or sparkle) prefixes the choice text: `✦ 18 gems — Kiss him back`
- The gem count is shown prominently in the choice button
- The locked choice is styled differently: gold/purple border, slightly dimmed text, gem icon glowing
- Free alternative is always present alongside — you can always continue the story for free, just with a less exciting outcome

**What the free path looks like:**
- Free choices lead to "safe" or "neutral" outcomes
- The copy is written to make the free choice feel slightly incomplete: "Turn away" vs `✦ 18 gems — Kiss him back`
- This is deliberate FOMO design, not a blocker

**When gems are insufficient — the upsell trigger:**

1. Player taps gem choice → app checks balance
2. If insufficient: bottom sheet or modal slides up (never full screen nav away — that kills immersion)
3. Modal shows:
   - Gem icon + current balance prominently
   - "You need X more gems for this choice"
   - 2–3 bundle options listed vertically (cheapest → best value)
   - "Get gems free" link (takes to ad watching / quest list) — reduces buyer pressure
   - X dismiss button clearly visible — not a dark pattern, players feel safe exploring
4. Player dismisses → returns to the choice screen (story does not advance)
5. If they pick a bundle → OS purchase sheet → gems credited → choice auto-unlocked

**Key design principle from Episode's writer docs:**
> "A reader should never reflect on a Gem Choice and think 'why did I pay for that?' Real value builds trust."

This means the locked choice copy must preview real payoff. Not "special scene" — instead: "Tell him you've been thinking about him too."

### Recommendation for Chaptr

- Show gem choices inline, same slot as free choices — never hide them
- Label: `✦ 10 gems` in a small badge preceding the choice text
- Use warm gold (#F5C842 or similar) for the gem lock state — not red (red = error)
- On insufficient gems: slide-up bottom sheet, not a blocking modal
- Always show the free alternative — never a dead end
- Bottom sheet copy: "You have [N] gems. This choice needs 10." + two CTAs: "Watch to earn gems" (ad) and "Get gems" (IAP)
- In PoC: replace the IAP CTA with "Coming soon" — don't block, just inform

---

## 3. Selfie / Avatar Onboarding UX

### What Reduces Drop-off on Camera Permission

The research consensus (NN/g, Appcues, Zigpoll) converges on four principles:

**1. Just-in-time asking**
Never ask for camera permission at launch or during account setup. Ask only when the user is about to use a feature that needs it — ideally after they've already invested in the story (completed chapter 1). Drop-off rates are 30–40% lower when requests are contextual vs. upfront.

**2. Pre-permission primer screen**
Before the OS dialog appears (iOS/Android), show a custom screen explaining:
- What the photo is for (in plain language, not legalese)
- What you do NOT do with it (no server upload, no sharing)
- What the experience looks like after (show a preview mockup)

The OS dialog should feel like a formality after the primer, not the primary ask.

**3. Value-first framing, not permission-first framing**
Bad: "Allow camera access to continue"
Good: "See yourself in the story — upload a selfie to appear in key scenes"

The user grants the permission as a side-effect of wanting a feature, not as a compliance step.

**4. Always offer a skip**
Mandatory photo upload = 25–40% abandonment in teen demographics based on standard onboarding research. The skip path must be visible, non-shaming, and lead to a working experience (use a default illustrated avatar). You want the skip to exist but feel like a downgrade, not an escape.

### Privacy Messaging That Works for 13–22 Female Demographic

This demographic is privacy-aware but also highly motivated by personalization. The tension is: they want to see themselves in the story, but they're cautious about where photos go.

**Effective copy patterns (synthesized from research):**

| Pattern | Example |
|---------|---------|
| Local-only framing | "Your photo never leaves your device" |
| Purpose limitation | "Used only to place you in story scenes" |
| No-storage promise | "We don't save, share, or see your photo" |
| Control language | "You can remove it anytime in settings" |
| FOMO framing | "Your face appears in 12 scenes in this story" |

**What to avoid:**
- "We need your permission" — sounds bureaucratic, raises suspicion
- "To improve your experience" — too vague, sounds like data harvesting language
- Long privacy policy links on the primer screen — kills momentum
- Camera-only language (suggests real-time capture) when you actually want file upload

**Recommended framing for Chaptr's primer screen:**

```
Headline: "Make the story yours"
Body:     "Upload a selfie — your face appears in key scenes.
           Your photo stays on your device and is never uploaded or shared."
CTA:      "Choose a photo"
Skip:     "Use an illustrated avatar instead →"
```

The word "illustrated avatar" makes the skip feel like a downgrade (generic) vs. the main path (personalized), which nudges toward photo upload without being coercive.

---

## 4. Face Crop UI Patterns for Mobile Web

### Portrait Crop Interface: How to Build It

**Recommended approach: `react-easy-crop`**

- 125k+ weekly npm downloads, actively maintained
- Supports any aspect ratio (use `4/5` for portrait — this is the standard for profile/story use)
- Touch and pinch-zoom support built in (critical for mobile web)
- Outputs a `croppedAreaPixels` object → pass to a canvas `drawImage` call to generate the final cropped Blob
- Zero external dependencies

```bash
npm install react-easy-crop
```

**Aspect ratio recommendation:**
- Use `4:5` (portrait, standard Instagram-style) — feels natural for "face photo"
- Do NOT use `1:1` (feels like a profile pic, not a story protagonist)
- Do NOT use `9:16` (too tall — face becomes tiny)

**Implementation flow:**

```
1. File input (<input type="file" accept="image/*" capture="user">)
   → "capture=user" opens front camera on mobile by default
2. FileReader.readAsDataURL() → load into <img> tag as crop source
3. react-easy-crop renders the drag/zoom interface
4. On "Confirm" → canvas.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh)
5. canvas.toBlob() → store as local blob URL (no upload needed)
```

**Native Browser Face Detection API (experimental, enhancement only)**
- Chrome/Edge support the Shape Detection API's `FaceDetector`
- Use it to auto-center the crop region on the detected face when the image is loaded
- Treat it as progressive enhancement: if FaceDetector is available, pre-position the crop; otherwise default to center crop
- Do not depend on it as the primary UX — Safari support is absent as of 2025

**Canvas vs CSS-only:**
Use Canvas. CSS-only crop (using `object-position` or `clip-path`) cannot export a cropped image as data. For Chaptr's use case (displaying the cropped face in story scenes), you need an actual image Blob, not a CSS trick.

### Crop Preview UI Pattern

- Show a circular crop preview thumbnail in the top-right corner of the crop interface (reinforces "this is your face in the story")
- After confirm: show a "story scene preview" — the cropped face composited into a static illustration
- This preview moment is high-retention; users who see themselves in a scene are significantly less likely to drop off

---

## 5. Faking a Face-Swap Protagonist (No AI Required)

### The CSS Overlay Technique

You do not need actual image generation. The illusion is achieved with CSS compositing:

**Technique: Circular face thumbnail floating over a character silhouette**

```css
.protagonist-frame {
  position: relative;
  width: 300px;
  height: 400px;
}

.character-silhouette {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Pre-made illustration with transparent face region */
}

.user-face {
  position: absolute;
  top: 18%;      /* Adjust to match silhouette's face position */
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  border: 2px solid rgba(255,255,255,0.3);
  mix-blend-mode: normal;
}
```

**Art direction for the silhouette illustration:**
- Commission character art with a deliberately obscured or shadowed face (hair falling forward, backlit, looking slightly away)
- This makes the photo thumbnail feel like a "reveal" rather than an overlay
- Alternatively: use an oval/circle cut-out region in the illustration where the face thumbnail sits naturally

**CSS `mix-blend-mode` enhancement:**
- `mix-blend-mode: luminosity` on the face thumbnail blends it more naturally into illustrated art styles
- `mix-blend-mode: multiply` works well if the illustration has warm tones
- Test both — `normal` is safest for photorealistic face on illustrated body

**Alternative: Polaroid / Photo-in-Story technique**
- Rather than trying to composite a face onto a body, show the user's photo in a "photo frame" within the scene
- E.g. a character holds a polaroid with the user's face on it, or there's a mirror showing the user's photo
- This is lower-fidelity but requires zero art direction changes and feels intentional (meta/charming)

**In-story usage: when to show the face**
- Chapter cover screens: silhouette + face overlay (the "protagonist card")
- Key emotional moments: dialogue close-ups where the character is described reacting to "you"
- Story completion screen: "You've completed Chapter 1" with the protagonist card shown
- Do NOT use on every screen — the effect dilutes. Reserve it for emotionally salient moments.

---

## 6. Key Implementation Decisions for Chaptr PoC

| Decision | Recommendation | Rationale |
|----------|----------------|-----------|
| Gem balance start | 30 gems | Covers 3 premium choices, enough to feel the mechanic |
| Premium choice cost | 10 gems | Round number, easy mental math for the player |
| Locked choice visual | Gold border + `✦ 10 gems` badge inline | Matches Episode/Choices pattern, not a blocker |
| Insufficient gems UX | Bottom sheet slide-up | Preserves immersion, not a nav interruption |
| Photo ask timing | After chapter 1, not at launch | Maximises investment before ask |
| Primer screen | "Make the story yours" + local-only promise | Value-first framing |
| Skip option | "Use illustrated avatar" label | Makes skip feel like downgrade, not escape |
| Crop library | `react-easy-crop` at 4:5 aspect ratio | Best mobile touch support, widely maintained |
| Face compositing | CSS absolute position on illustrated silhouette | No AI needed, illustrator-friendly |
| Face detection | Progressive enhancement via Shape Detection API | Optional auto-center, not load-bearing |

---

## Sources

- [Episode Gem Choice Guide — Official Writer's Portal](https://pocketgems-support.helpshift.com/hc/en/10-episode-writer-s-portal/faq/380-gem-choice-guide/)
- [Getting Started with Gem Choices — Episode Writer's Portal](https://pocketgems-support.helpshift.com/hc/en/10-episode-writer-s-portal/faq/235-getting-started-with-gem-choices/)
- [Weak Gem Choices & Why We Don't Like Them — Episode](https://pocketgems-support.helpshift.com/hc/en/10-episode-writer-s-portal/faq/390-gem-choice-help-weak-gem-choices-why-we-don-t-like-them/)
- [How to Get Free Gems in Episode — The Cognitive Orbit](https://www.sdpuo.com/how-to-get-gems-on-episode-for-free/)
- [Choices: Stories You Play Monetization Strategy Revealed — Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/choices-stories-you-play-monetization)
- [Love and Deepspace Monetization Strategy — PlayfulBrainDemand](https://playfulbraindemand.com/2025/05/27/love-and-deepspace-and-its-monetization-strategy-a-case-study/)
- [Asking Nicely: 3 Strategies for Successful Mobile Permission Priming — Appcues](https://www.appcues.com/blog/mobile-permission-priming)
- [3 Design Considerations for Effective Mobile-App Permission Requests — NN/g](https://www.nngroup.com/articles/permission-requests/)
- [Permission Priming — UserOnboard](https://www.useronboard.com/onboarding-ux-patterns/permission-priming/)
- [Mobile UX Design: The Right Ways to Ask Users for Permissions — UX Planet](https://uxplanet.org/mobile-ux-design-the-right-ways-to-ask-users-for-permissions-6cdd9ab25c27)
- [8 Great React Image Croppers For 2025 — PQINA/Pintura](https://pqina.nl/pintura/blog/8-great-react-image-croppers/)
- [react-easy-crop — npm](https://www.npmjs.com/package/react-easy-crop)
- [Smart Cropping with Native Browser Face Detection — Dave Bitter](https://www.davebitter.com/articles/native-face-detection-cropping)
- [Top React Image Cropping Libraries — LogRocket](https://blog.logrocket.com/ux-design/modal-ux-design-patterns-examples-best-practices/)
- [Upsell Prompts — GoodUX / Appcues](https://goodux.appcues.com/categories/upsell-prompts)
