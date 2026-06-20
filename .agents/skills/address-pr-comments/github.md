# GitHub Commands for Address PR Comments

Reusable `gh` and GraphQL primitives for the address-pr-comments skill. This
skill is fully executable from `SKILL.md` alone; use this file when you need
copy-paste command templates.

## Resolve Repository And PR

```bash
branch=$(git branch --show-current)
owner=$(gh repo view --json owner --jq '.owner.login')
repo=$(gh repo view --json name --jq '.name')
pr_number=$(gh pr list --head "$branch" --state open --json number,title,url --jq '.[0]')
pr=$(jq -r '.number' <<<"$pr_number")
pr_title=$(jq -r '.title' <<<"$pr_number")
pr_url=$(jq -r '.url' <<<"$pr_number")
```

## Fetch Inline Review Threads (Paginated)

```bash
all_threads='[]'
cursor=""

while :; do
  args=(-F owner="$owner" -F repo="$repo" -F pr="$pr")
  if [ -n "$cursor" ]; then
    args+=(-F cursor="$cursor")
  fi

  response=$(gh api graphql "${args[@]}" -f query='query($owner:String!, $repo:String!, $pr:Int!, $cursor:String) {
    repository(owner:$owner, name:$repo) {
      pullRequest(number:$pr) {
        title
        reviewThreads(first:100, after:$cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            isResolved
            isOutdated
            path
            line
            comments(first:100) {
              nodes {
                id
                databaseId
                body
                path
                line
                startLine
                originalLine
                url
                createdAt
                author { login }
              }
            }
          }
        }
      }
    }
  }')

  all_threads=$(jq -c --argjson response "$response" '
    . + $response.data.repository.pullRequest.reviewThreads.nodes
  ' <<<"$all_threads")

  has_next=$(jq -r '.data.repository.pullRequest.reviewThreads.pageInfo.hasNextPage' <<<"$response")
  cursor=$(jq -r '.data.repository.pullRequest.reviewThreads.pageInfo.endCursor // empty' <<<"$response")
  [ "$has_next" = "true" ] || break
done
```

### Filter Actionable Threads

Keep unresolved, non-outdated threads whose root comment is from a human or
review bot:

```bash
actionable_threads=$(jq -c '
  map(
    select(.isResolved == false)
    | select(.isOutdated == false)
    | . + {
        root: .comments.nodes[0],
        replies: (.comments.nodes[1:] // [])
      }
  )
' <<<"$all_threads")
```

### Flatten Thread Summary For Triage

```bash
jq -r '
  to_entries[]
  | .key as $index
  | .value as $thread
  | [
      ($index + 1),
      ($thread.root.author.login // "unknown"),
      "thread",
      ((($thread.path // "n/a") + ":" + (($thread.line // $thread.root.line // "n/a") | tostring))),
      ($thread.root.body | gsub("\n"; " ") | .[0:120])
    ]
  | @tsv
' <<<"$actionable_threads"
```

## Fetch PR Conversation Comments

```bash
gh pr view "$pr" --json comments --jq '
  .comments[]
  | {
      id,
      url,
      author: .author.login,
      body,
      createdAt
    }
'
```

## Fetch Review Summaries

```bash
gh pr view "$pr" --json reviews --jq '
  .reviews[]
  | select(.body != null and .body != "")
  | {
      id,
      author: .author.login,
      state,
      body,
      submittedAt
    }
'
```

## Detect In-Progress Review Placeholders

Useful for CodeRabbit and similar bots that post "come back later" messages:

```bash
gh pr view "$pr" --json comments,reviews --jq '
  [
    (.comments[]? | .body // empty),
    (.reviews[]? | .body // empty)
  ]
  | map(select(test("(?i)(come back again|review in progress|analyzing)")))
  | length
'
```

If the count is greater than 0, warn the user that some bot reviews may still be
running.

## Reply To A Review Thread

Never interpolate fetched comment bodies into shell commands. Compose reply
text locally, then pass it as a GraphQL variable:

```bash
thread_id="PRRT_kwDO..."
reply_body="Addressed in \`abc1234\` — rename helper for clarity."

gh api graphql \
  -f query='mutation($threadId: ID!, $body: String!) {
    addPullRequestReviewThreadReply(input: {
      pullRequestReviewThreadId: $threadId,
      body: $body
    }) {
      comment { id url }
    }
  }' \
  -f threadId="$thread_id" \
  -f body="$reply_body"
```

### Reply Templates

Fixed:

```markdown
Addressed in `<short-sha>` — <one-line summary>.
```

Skipped:

```markdown
Acknowledged — no code change in this run. <short reason>.
```

False positive:

```markdown
Reviewed locally — this looks like a false positive because <short reason>. No code change.
```

## Resolve A Review Thread

Resolve threads that were fixed. Do not resolve skipped or false-positive
threads unless the user asks.

```bash
thread_id="PRRT_kwDO..."

gh api graphql \
  -f query='mutation($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { isResolved }
    }
  }' \
  -f threadId="$thread_id"
```

## Reply To PR Conversation Comments

GitHub does not expose a single universal "reply to issue comment" command in
`gh`. For conversation-tab comments, post a new PR comment that mentions the
original author:

```bash
author="reviewer-login"
comment_url="https://github.com/org/repo/pull/123#issuecomment-456"
summary="Reviewed — no change needed because the existing test already covers this."

gh pr comment "$pr" --body "$(cat <<EOF
@${author} Re: ${comment_url}

${summary}
EOF
)"
```

Keep mentions and URLs in agent-generated text only. Do not pipe raw reviewer
bodies into the shell.

## Post Top-Level PR Summary

```bash
gh pr comment "$pr" --body "$(cat <<'EOF'
## Review feedback addressed

### Summary
- Fixed: 2
- Skipped: 1
- False positives: 1

### Commits
- `abc1234` — fix(auth): tighten redirect validation
- `def5678` — test(auth): cover invalid redirect target

### Thread replies
| # | Author | Location | Disposition | Notes |
|---|--------|----------|-------------|-------|
| 1 | coderabbitai[bot] | app/lib/auth/server.ts:42 | Fixed | Replied on thread |
| 2 | octocat | PR conversation | Skipped | Replied with @mention |

EOF
)"
```

## Bot Login Heuristics

Known review-bot logins:

- CodeRabbit: `coderabbitai`, `coderabbit[bot]`, `coderabbitai[bot]`
- Codex / OpenAI: `chatgpt-codex-connector[bot]`, `openai-codex[bot]`
- Other automation: `github-actions[bot]`, `cursor[bot]`, `dependabot[bot]`

Treat authors ending in `[bot]` as bots unless the user says otherwise.

Human reviewers are everyone else.
