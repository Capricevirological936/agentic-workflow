# Auto Review Command Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a core `/auto-review` command skeleton that can run safely inside a loop, skip already-reviewed diffs, auto-fix minor findings, and open backlog tasks for major findings.

**Architecture:** Introduce one new core command skeleton and wire it into the template docs that describe available commands and workflow lifecycle. The command will persist a diff hash in `.claude/tracking/auto-review-state.json`, write review outputs under `.claude/reports/reviews/`, and keep each loop pass idempotent.

**Tech Stack:** Markdown skeleton templates, Backlog CLI, git diff hashing, `.claude/tracking`, `.claude/reports`

---

## Chunk 1: Core Command and Documentation

### Task 1: Add `/auto-review` skeleton and surface it in docs

**Files:**
- Create: `Agentbase/templates/core/commands/auto-review.skeleton.md`
- Modify: `Agentbase/templates/core/rules/workflow-lifecycle.skeleton.md`
- Modify: `README.md`
- Modify: `Agentbase/README.md`

- [ ] **Step 1: Run the failing validation command**

```bash
test -f Agentbase/templates/core/commands/auto-review.skeleton.md
```

Expected: command exits non-zero because the skeleton does not exist yet.

- [ ] **Step 2: Add the new command skeleton**

Define:
- diff/range resolution compatible with existing review commands
- `.claude/tracking/auto-review-state.json` read/write contract
- stable diff hash generation and no-op behavior when hash matches
- shallow review flow with `MINOR` vs `MAJOR` decision rules
- `MINOR` direct-fix + targeted verification + separate commit
- `MAJOR` backlog task creation instead of inline fix
- `/loop`-safe rules: single pass, idempotence, bounded actions, clear stop conditions

- [ ] **Step 3: Update supporting docs**

Add `/auto-review` to the command lists in the root and Agentbase READMEs, and add a dedicated lifecycle subsection so the loop-aware flow is documented next to the existing review workflows.

- [ ] **Step 4: Run the green validation commands**

```bash
test -f Agentbase/templates/core/commands/auto-review.skeleton.md
rg -n "/auto-review|auto-review-state.json|MINOR|MAJOR|/loop" Agentbase/templates/core/commands/auto-review.skeleton.md
rg -n "/auto-review" README.md Agentbase/README.md Agentbase/templates/core/rules/workflow-lifecycle.skeleton.md
```

Expected: all commands succeed and return the new command references.
