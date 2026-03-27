---
phase: 4
slug: static-story-content
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + Testing Library React 16.3.2 |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `npx vitest run src/__tests__/chapter1.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/__tests__/chapter1.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 0 | STORY-01, STORY-02, STORY-03, STORY-04 | unit | `npx vitest run src/__tests__/chapter1.test.ts` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 0 | READ-03 | unit (component) | `npx vitest run src/__tests__/StoryReaderPage.test.tsx` | ❌ W0 | ⬜ pending |
| 4-01-03 | 01 | 1 | STORY-01, STORY-04 | unit | `npx vitest run src/__tests__/chapter1.test.ts` | ❌ W0 | ⬜ pending |
| 4-01-04 | 01 | 1 | STORY-01 | unit | `npx vitest run src/__tests__/chapter1.test.ts` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 1 | STORY-01, STORY-02, STORY-03 | unit | `npx vitest run src/__tests__/chapter1.test.ts` | ❌ W0 | ⬜ pending |
| 4-02-02 | 02 | 1 | STORY-04 | unit | `npx vitest run src/__tests__/chapter1.test.ts` | ❌ W0 | ⬜ pending |
| 4-02-03 | 02 | 2 | STORY-04 | manual | Visual playthrough in browser | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/chapter1.test.ts` — graph integrity tests: all nextBeatId/choice references exist, first choice within 300 words, 3+ branches resolve, [Name] present, no real celebrity names, full playthrough reaches isChapterEnd (covers STORY-01, STORY-02, STORY-03, STORY-04)
- [ ] `src/__tests__/StoryReaderPage.test.tsx` — READ-03 onAdvance fix: prose-only beat with nextBeatId advances on tap; prose-only beat without nextBeatId does not advance (covers READ-03)

*Note: `vitest.config.ts` exists and Framer Motion mock pattern is established in `ChoiceList.test.tsx` — copy for component tests.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Name prompt appears on `/story/chapter-1` when userName is null | STORY-02 | Requires full browser render + localStorage clear | Open in browser, clear localStorage, navigate to `/story/chapter-1`, verify modal appears |
| Chapter-end overlay renders with pulsing animation | STORY-04 | Animation requires visual inspection | Play through to beat-5 (chapter end), verify overlay fade-in and "Chapter Complete" heading |
| Gem gate blocks locked choice on insufficient balance | STORY-01 | Requires UI interaction simulation | Set gem balance to 0, select gem-gated choice, verify GemGateSheet appears |
| Full playthrough — all 3 opening branches complete without crash | STORY-04 | End-to-end narrative flow | Play choice A path, reload, play choice B path (Mina), reload, play choice C (gem) path |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
