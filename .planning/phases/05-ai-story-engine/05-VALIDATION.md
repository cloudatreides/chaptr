---
phase: 5
slug: ai-story-engine
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.1.2 + @testing-library/react |
| **Config file** | vite.config.ts (no separate test block — vitest defaults apply) |
| **Quick run command** | `npx vitest run src/__tests__/claudeStream.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/__tests__/claudeStream.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 0 | AI-01,02,03,04,05,06,07 | unit stubs | `npx vitest run src/__tests__/claudeStream.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | AI-01,AI-02 | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-03 | 01 | 1 | AI-03,AI-07 | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-04 | 01 | 1 | AI-05 | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-05 | 01 | 1 | AI-06 | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 0 | AI-01 (UX) | unit stubs | `npx vitest run src/__tests__/useStreamingTypewriter.test.ts` | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 1 | AI-01 (UX) | unit | `npx vitest run src/__tests__/useStreamingTypewriter.test.ts` | ❌ W0 | ⬜ pending |
| 05-02-03 | 02 | 1 | AI-01 model ID | grep | `grep -r 'claude-3-haiku' src/` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/claudeStream.test.ts` — stubs for AI-01 through AI-07 (all failing initially)
- [ ] `src/__tests__/useStreamingTypewriter.test.ts` — stubs for streaming hook behavior

*Both files must be created before any implementation code is written.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Streaming prose appears within ~2s of a choice | AI-01 (latency) | Requires real API call + visual observation | Make a choice in browser, watch first character appear |
| Choice history reflected in AI prose | AI-06 (content) | Requires reading AI output and comparing to prior choices | Make 2+ choices, verify prose references earlier decisions |
| Prohibited phrases absent from AI output | AI-07 (content) | Requires sampling multiple AI responses | Play 3+ beats, check no banned phrases appear |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
