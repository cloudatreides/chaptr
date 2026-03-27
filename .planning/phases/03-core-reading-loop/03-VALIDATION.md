---
phase: 3
slug: core-reading-loop
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| **Config file** | vitest.config.ts (jsdom env, globals: true) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | VIZ-01 | visual | `npx vitest run` | ✅ existing | ⬜ pending |
| 03-01-02 | 01 | 1 | VIZ-02 | visual | `npx vitest run` | ✅ existing | ⬜ pending |
| 03-02-01 | 02 | 1 | READ-02 | unit | `npx vitest run src/__tests__/useTypewriter.test.ts -t "typewriter"` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | READ-03 | unit | `npx vitest run src/__tests__/useTypewriter.test.ts -t "skip"` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 2 | READ-04 | unit | `npx vitest run src/__tests__/ChoiceList.test.tsx -t "hidden"` | ❌ W0 | ⬜ pending |
| 03-02-04 | 02 | 2 | READ-05 | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "gem"` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 1 | GEM-01 | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "gem"` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 1 | GEM-02 | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "spend"` | ⚠️ partial | ⬜ pending |
| 03-03-03 | 03 | 1 | GEM-03 | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "persist"` | ❌ W0 | ⬜ pending |
| 03-03-04 | 03 | 2 | SIDE-02 | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "decision"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/useTypewriter.test.ts` — stubs for READ-02, READ-03
- [ ] `src/__tests__/ChoiceList.test.tsx` — stubs for READ-04
- [ ] `src/__tests__/useChaptrStore.test.ts` — stubs for READ-05, GEM-01, GEM-02, GEM-03, SIDE-02

*Existing infrastructure (Vitest + @testing-library/react) already installed — no framework install needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reader layout at 1440px viewport | DESK-01 | Pixel-level visual layout verification | Open app at 1440px width; confirm left sidebar visible + 680px reading column + full-width scene image |
| Vaul bottom sheet slides up (gem gate) | READ-06 | DOM interaction with Vaul drag handle | Attempt gem-gated choice with 0 gems; confirm sheet slides up from bottom without full-screen interrupt |
| Sidebar opens as bottom sheet on mobile | SIDE-01 | Responsive behavior requires viewport resize | Resize to 375px; tap sidebar trigger; confirm bottom sheet appears |
| Sidebar opens as left panel on desktop | SIDE-03 | Desktop panel behavior | At lg: breakpoint, confirm sidebar opens as fixed left panel at 280px width |
| Rose gradient on selected choice | READ-07 | CSS gradient visual | Select a choice; confirm selected choice shows rose gradient; unchosen dim to 30% opacity |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
