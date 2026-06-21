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
2. **The scope boundary** -- which feature module(s) are involved? Identify the real modules from the codebase (e.g., domain folders under `app/lib/*`, route groups under `app/routes/*`, or shared platform services) rather than assuming a fixed list. Mark as cross-cutting if it spans multiple modules.
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
2. **Use file paths relative to the project root** (e.g., `app/lib/<module>/<name>.server.ts`).
3. **Be specific about patterns.** Instead of "follow existing patterns", name the specific file and function that demonstrates the pattern (e.g., "follow the loader extraction pattern in `app/lib/<module>/routes/<page>-loader.server.ts`").
4. **Quote relevant AGENTS.md rules** when they directly constrain the task. Keep quotes brief -- one sentence per rule, with the file reference.
5. **Include type signatures** of existing functions or interfaces that the work will interact with, when those signatures are non-obvious and important for correctness.
6. **Branch & Commit guidance**: Always include the `Branch & Commit` section. If the task touches 3+ files or has clearly separable phases (e.g., schema change → service logic → UI → tests), suggest step-by-step commits with a descriptive message for each. For small tasks (1-2 files, single concern), a single final commit is sufficient. If the user said to skip branching, omit the branch instruction but keep the commit guidance.

### Markdown Escaping

The final optimized prompt must be placed inside a markdown code fence so the user can copy it cleanly. Handle escaping as follows:

- **No code fences:** triple backticks with a `markdown` language tag.
- **Triple-backtick fences present:** quadruple backticks so the inner triple backticks do not escape.
- **Quadruple-backtick fences (rare):** quintuple backticks.

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

- Create a feature branch: `git checkout -b feat/project-due-date`
- This task has multiple logical steps. Commit after each step:
  1. After adding the schema field and migration → `feat(db): add dueDate to project model`
  2. After updating the query and service layer → `feat(projects): support dueDate in service layer`
  3. After wiring the route action and UI → `feat(projects): surface due date in dashboard`
  4. After adding tests → `test(projects): cover dueDate validation and queries`
- Run the quality gate (`pnpm lint`, `pnpm typecheck`, `pnpm test`) after the
  final commit.

## Objective

Add an optional `dueDate` field to the sample projects domain so a user can set
a deadline on a project, and surface it on the dashboard project list.

## Context

- The sample projects domain lives in `app/lib/demo/` and is wired through
  `app/routes/demo/dashboard/projects.tsx`.
- Route modules must stay thin: `loader`/`action`/`meta`/`ErrorBoundary`
  exports delegate to focused functions in `app/lib` (root AGENTS.md).
- Prisma owns the schema under `prisma/schema.prisma`; Kysely owns runtime
  queries in `app/lib/demo/projects.server.ts` (root AGENTS.md). The
  `project` model already has `archived`, `slug`, and `metadata` fields.
- Every loader/action that reads user-owned data must call
  `requireAuth(request)` (root AGENTS.md), even though the parent dashboard
  layout is protected. The existing action handler in
  `app/lib/demo/projects-page.server.ts` shows the `requireAuth` + form-intent
  pattern to follow.
- Use `<Form method="post">` for mutations that navigate after submit and
  `useFetcher` for inline mutations (root AGENTS.md).

## Affected Files

### Files to Modify

- `prisma/schema.prisma` -- Add `dueDate DateTime? @db.Timestamptz(6)` to the
  `project` model.
- `app/lib/demo/projects.server.ts` -- Add `dueDate` to the
  `projectSelection` list and accept it in `createProject` and
  `updateProject`.
- `app/lib/demo/projects-page.server.ts` -- Add optional `dueDate` parsing
  to the Zod schemas and pass it through to the service functions.
- `app/routes/demo/dashboard/projects.tsx` -- Route module. Surface `dueDate`
  in the loader data and the project form.

### Files to Create

(No new modules required -- the existing `projects.server.ts` query module is
the right home for the dueDate handling.)

### Files to Reference

- `app/lib/auth/index.server.ts` -- Exports `requireAuth`, the auth helper to
  reuse in the loader and action.
- `app/lib/utils/index.ts` -- Exports `readFormString`, the form-field parsing
  helper the existing action handler uses.

## Requirements

1. Add an optional `dueDate` field (nullable timestamptz) to the `project`
   model and a Prisma migration.
2. `createProject` and `updateProject` must accept and persist `dueDate`.
3. The dashboard project list must display `dueDate` when set.
4. Regenerate Kysely database types (`pnpm db:generate`) so the new column is
   typed at runtime.

## Constraints

- Module boundary: keep all SQL in `app/lib/demo/projects.server.ts`; do not
  run raw queries from the route module (root AGENTS.md).
- Reuse `requireAuth(request)` in both the loader and the action (root
  AGENTS.md).
- Use the `~/*` path alias for imports from `app` (root AGENTS.md).
- pnpm is the package manager. Do not use `npm install`.
- Do not hand-edit generated files (`app/lib/db/database-types.ts`,
  `.react-router/**`).

## Acceptance Criteria

1. A project can be created and updated with an optional due date.
2. The due date renders on the dashboard project list when present.
3. `pnpm db:generate` succeeds and the `dueDate` column is reflected in the
   Kysely types.
4. `pnpm lint` passes with zero errors.
5. `pnpm typecheck` passes with zero errors.
6. `pnpm test` passes, including unit tests for dueDate parsing and the
   updated create/update functions.

## Open Questions

1. Should the dashboard also show a separate "upcoming deadlines" list sorted
   by due date, or is surfacing the date inline sufficient for now?
2. Should `dueDate` be editable from the inline project row, or only from a
   dedicated edit form?
```
````

**Summary**: 4 files to modify, 0 files to create, 2 files to reference. 4 requirements. 2 open questions.
