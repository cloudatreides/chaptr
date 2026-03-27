---
phase: 2
slug: onboarding-flow
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + @testing-library/react + @testing-library/jest-dom + jsdom |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 0 | ONB-01..VIZ-03 | setup | `npx vitest run` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | ONB-01 | unit | `npx vitest run src/__tests__/LandingPage.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 2 | ONB-02, ONB-03, VIZ-03 | unit | `npx vitest run src/__tests__/UniversesPage.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | ONB-04, ONB-05, ONB-07 | unit | `npx vitest run src/__tests__/SelfieUploadModal.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | ONB-06 | unit | `npx vitest run src/__tests__/cropImage.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Install `vitest @testing-library/react @testing-library/jest-dom jsdom` as devDependencies
- [ ] Create `vitest.config.ts` with jsdom environment
- [ ] `src/__tests__/LandingPage.test.tsx` — stubs for ONB-01
- [ ] `src/__tests__/UniversesPage.test.tsx` — stubs for ONB-02, ONB-03, VIZ-03
- [ ] `src/__tests__/SelfieUploadModal.test.tsx` — stubs for ONB-04, ONB-05, ONB-07
- [ ] `src/__tests__/cropImage.test.ts` — stubs for ONB-06

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Staggered card entrance animation | VIZ-03 | CSS/Framer Motion timing is visual | Load /universes in browser, observe cards stagger-enter on mount |
| Cinematic silhouette background | ONB-01 | SVG artwork is visual | Load / in browser, verify dark background with character silhouettes |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
