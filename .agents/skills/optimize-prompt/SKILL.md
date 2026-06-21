---
name: optimize-prompt
description: Analyze a rough coding prompt and the codebase to produce a structured, enriched prompt that a more capable model can immediately execute. Explores affected files, module boundaries, existing patterns, and constraints so the expensive model skips exploration. Use when the user asks to optimize a prompt, enrich a prompt, prepare a prompt for implementation, analyze a task for handoff, or says "optimize-prompt".
---

# Optimize Prompt

Take a rough coding prompt from the user, explore the codebase to gather context, and produce a structured, information-rich prompt that a more capable model can use to immediately plan or implement -- without wasting expensive tokens on codebase exploration.

## Philosophy

- **You do the exploration. The stronger model does the thinking.** Your output is context, constraints, and requirements -- never implementation strategy.
- **Breadth first, depth second.** Cast a wide net across the codebase before drilling into specific files.
- **Stop on ambiguity.** If the raw prompt admits multiple valid approaches with meaningfully different tradeoffs, ask the user to decide before producing the enriched prompt.

## Step 1: Clarify the Raw Prompt

Read the user's raw prompt and extract:

1. **The core goal** -- what does the user want to change, add, or fix?
2. **The scope boundary** -- which feature module(s) are involved? (Workspace Migration, Assignment History Sync, TLF Review, shared platform services, or cross-cutting?)
3. **Any implied constraints** -- deadlines, compatibility requirements, or references to existing tasks/docs.

### Ambiguity Gate

Before proceeding to codebase exploration, evaluate the raw prompt against these criteria. If **any** are true, STOP and ask the user to clarify:

- The prompt is vague enough that you cannot identify at least one affected file path or module.
- The task crosses a module boundary in a way that violates the rules in `AGENTS.md`, and it is unclear whether the user intends an exception.
- There are two or more valid interpretations that would lead to significantly different file sets or approaches.
- The prompt references functionality that does not appear to exist in the codebase, and you cannot determine whether it is a new feature or a misunderstanding.

When stopping, present the specific ambiguity and offer concrete options for the user to choose from. Do not guess.

## Step 2: Explore the Codebase

Use search and read tools to gather context. Prioritize in this order:

1. **Structural search** -- Use `codegraph_search`, `codegraph_context`, or `search_codebase` to find symbols, modules, and relationships related to the task.
2. **File discovery** -- Use glob/search to find files matching relevant patterns.
3. **Targeted reading** -- Read specific files or sections identified by the above steps. Focus on:
   - Module boundaries and exports (barrel files, `index.ts`)
   - Existing patterns the new work must follow (similar features already implemented)
   - Type definitions and DTOs that define contracts
   - Route files that wire the feature
   - AGENTS.md files in relevant directories (`app/lib/AGENTS.md`, `app/routes/AGENTS.md`, `app/ui/AGENTS.md`, `prisma/AGENTS.md`)
4. **Constraint gathering** -- Read the root `AGENTS.md` for module boundary rules, tech stack constraints, and testing requirements relevant to the affected area.

### What to Collect

For each affected file or module, note:

- Its role (what it does today)
- Why it is affected (what about it relates to the task)
- Any relevant patterns it follows (so the stronger model can replicate them)

Do NOT read entire large files. Read only the sections relevant to the task: exports, key function signatures, type definitions, and module boundaries.

## Step 3: Produce the Optimized Prompt

Write the enriched prompt using the structure defined below. The output must be self-contained -- a stronger model receiving this prompt should not need to explore the codebase further before planning.

### Optimized Prompt Structure

Use these sections. Omit a section only if it is genuinely empty (which should be rare).

```
## Branch & Commit
- Create a feature branch before starting: `git checkout -b <type>/<short-description>`
  (skip only if the user explicitly says so when invoking the task).
- If the task involves multiple logical steps, commit after completing each step
  with a conventional commit message (e.g., `feat:`, `fix:`, `refactor:`).
- Commit when the task is complete.

## Objective
1-2 sentences: what needs to be done and why.

## Context
- Module boundaries and feature area(s) involved
- Existing patterns and conventions the work must follow
- Key architectural constraints (server-only boundaries, data flow, type system)
- Relevant existing implementations that serve as reference patterns

## Affected Files
Group by role. For each file, state its current purpose and why it is affected.

### Files to Modify
- `path/to/file.ts` -- Current role. Why it needs to change.

### Files to Create (if known)
- `path/to/new-file.ts` -- Purpose and rationale for the new file.

### Files to Reference (read-only)
- `path/to/reference.ts` -- Pattern or contract to follow.

## Requirements
Numbered list of specific functional requirements extracted from the raw prompt.
Each requirement should be verifiable and unambiguous.

## Constraints
- Project rules from AGENTS.md that apply to this specific task
- Tech stack constraints (specific library versions, API version pins, etc.)
- Module boundary restrictions
- Security requirements
- Testing requirements

## Acceptance Criteria
Numbered list of conditions that must all be true for the work to be complete.
Include both functional checks and quality gate items (lint, typecheck, tests).

## Open Questions
Any remaining ambiguities or decisions the implementing model or user should
resolve before or during implementation. If none, write "None."
```

### Content Rules

1. **No implementation instructions.** Do not include "how to" guidance, code snippets showing the solution, or step-by-step implementation plans. Include WHAT, WHERE, and CONTEXT -- never HOW.
2. **Use file paths relative to the project root** (e.g., `app/lib/tlf-review/routes/session-detail-loader.server.ts`).
3. **Be specific about patterns.** Instead of "follow existing patterns", name the specific file and function that demonstrates the pattern (e.g., "follow the loader extraction pattern in `app/lib/tlf-review/routes/workspace-page-loader.server.ts`").
4. **Quote relevant AGENTS.md rules** when they directly constrain the task. Keep quotes brief -- one sentence per rule, with the file reference.
5. **Include type signatures** of existing functions or interfaces that the work will interact with, when those signatures are non-obvious and important for correctness.
6. **Branch & Commit guidance**: Always include the `Branch & Commit` section. If the task touches 3+ files or has clearly separable phases (e.g., schema change → service logic → UI → tests), suggest step-by-step commits with a descriptive message for each. For small tasks (1-2 files, single concern), a single final commit is sufficient. If the user said to skip branching, omit the branch instruction but keep the commit guidance.

### Markdown Escaping

The final optimized prompt must be placed inside a markdown code fence so the user can copy it cleanly. Handle escaping as follows:

- If the optimized prompt contains NO code fences: wrap it in triple backticks with `markdown` language tag.
- If the optimized prompt contains triple-backtick code fences: wrap the entire output in quadruple backticks (four backticks) so the inner triple backticks do not escape.
- If the optimized prompt contains quadruple-backtick fences (rare): wrap in quintuple backticks.

Always verify your output renders correctly -- the outer fence must not be broken by inner content.

## Step 4: Present the Result

After producing the optimized prompt:

1. Show the optimized prompt inside the properly escaped code fence.
2. Show a brief summary line below the fence:
   - Number of affected files (modify / create / reference)
   - Number of requirements
   - Number of open questions

## Example Output

Below is an example of what the optimized prompt output should look like for a hypothetical task.

````markdown
```markdown
## Branch & Commit

- Create a feature branch: `git checkout -b feat/migration-retry-logic`
- This task has multiple logical steps. Commit after each step:
  1. After creating the retry module → `feat: add retry with exponential backoff module`
  2. After integrating retry into the runner → `feat: integrate retry into migration runner`
  3. After adding tests → `test: add retry module unit tests`
- Run the quality gate (`pnpm lint`, `pnpm typecheck`, `pnpm test`) after the
  final commit.

## Objective

Add retry logic with exponential backoff to the migration job runner so that
transient Monday API failures (rate limits, network timeouts) do not cause
entire migration jobs to fail.

## Context

- The migration runner lives in `app/lib/migrations/` and executes as a
  server-side background job triggered from route actions.
- The Monday GraphQL client at `app/lib/monday/client.ts` already handles
  single-request retries for network errors but does NOT retry on 429
  (rate limit) responses or 5xx server errors.
- The job runner uses a database state machine (`migration_jobs` table) to
  track job status. Current statuses: `pending`, `running`, `completed`,
  `failed`. There is no `retrying` status.
- The Monday API daily budget is 25,000 requests/day (hard limit per AGENTS.md).
  Retries must count against this budget.
- The assignment history sync runner at `app/lib/assignment-history/runner/`
  has a similar pattern and would benefit from the same retry logic, but this
  task is scoped to migration only.

## Affected Files

### Files to Modify

- `app/lib/migrations/runner.server.ts` -- The main job runner loop. Needs
  retry wrapping around individual item/subitem migration calls.
- `app/lib/migrations/types.ts` -- Migration job types. May need a retry
  count field on the job status type.
- `app/routes/api/migration/$jobId.ts` -- Job status API route. May need to
  surface retry information in the response DTO.

### Files to Create

- `app/lib/migrations/retry.server.ts` -- New module for retry logic with
  backoff configuration, isolated for testability.

### Files to Reference

- `app/lib/monday/client.ts` -- Existing network-level retry pattern to stay
  consistent with.
- `app/lib/monday/budget.ts` -- Budget tracking. Retries must call
  `trackBudgetUsage()` so retry requests count against the daily limit.
- `app/lib/assignment-history/runner/runner.server.ts` -- Parallel runner
  implementation for pattern reference (do NOT import from it; module
  boundary rule).

## Requirements

1. When a Monday API call within the migration runner fails with a 429 or
   5xx response, retry up to 3 times with exponential backoff
   (1s, 2s, 4s base delays with jitter).
2. Each retry attempt must count against the Monday API daily budget.
3. If all retries are exhausted for a single item, mark that item as failed
   in the migration report and continue with the next item.
4. The migration job itself must not fail due to transient API errors for
   individual items -- only a catastrophic failure (e.g., database
   unreachable) should fail the entire job.
5. Retry attempts must be logged with structured JSON logs including the
   item ID, attempt number, and error type.

## Constraints

- Module boundary: `app/lib/migrations/*` must not import from
  `app/lib/tlf-review/*` or `app/lib/assignment-history/*` (AGENTS.md).
- Monday API version pinned to `2026-04` (AGENTS.md).
- All Monday API calls must remain server-side only (AGENTS.md).
- API keys must never appear in retry logs (security requirement from
  AGENTS.md). Use secret redaction.
- pnpm is the package manager. Do not add npm packages via `npm install`.
- Unit tests required for retry logic: success after N retries, exhaustion
  after max retries, budget tracking during retries.

## Acceptance Criteria

1. Migration runner retries transient Monday API failures (429, 5xx) up to
   3 times with exponential backoff.
2. Individual item failures after retry exhaustion are recorded in the
   migration report without failing the entire job.
3. Retry attempts are counted against the Monday API daily budget.
4. Structured JSON logs capture retry attempts with item ID, attempt number,
   and error type -- without leaking API keys.
5. `pnpm lint` passes with zero errors.
6. `pnpm typecheck` passes with zero errors.
7. `pnpm test` passes, including new unit tests for the retry module.

## Open Questions

1. Should the retry delay respect the `Retry-After` header from Monday 429
   responses when present, or always use the configured backoff schedule?
2. Should the retry count be configurable per-job, or is a hardcoded maximum
   of 3 sufficient for the foreseeable future?
```
````

**Summary**: 3 files to modify, 1 file to create, 3 files to reference. 5 requirements. 2 open questions.
