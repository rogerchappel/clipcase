# ClipCase PRD

Status: in-progress

## Summary

A local clipboard-to-casefile CLI for agents and developers: save snippets, prompts, terminal output, and URLs into tidy Markdown bundles without phoning home. 📋

## Source attribution

Created during the 2026-05-16 twice-daily OSS factory run because the unbuilt ready/backlog pool had fewer than five candidates. Inspired by personal knowledge-capture workflows, developer scratchpads, and agent evidence bundles; renamed/reframed as a deterministic local-first casefile tool rather than copying a specific app.

## Target users

- Developers collecting repro notes and terminal evidence.
- Agents preparing handoffs with copied context.
- Maintainers who want lightweight local notebooks without SaaS.

## Problem

Useful copied context evaporates into random notes, shell history, and chat transcripts. Repro evidence needs timestamps, source labels, dedupe, redaction checks, and exportable structure, but heavy note apps are overkill.

## Goals

- Capture text from stdin or the system clipboard into local case directories.
- Normalize snippets into Markdown entries with timestamps, source labels, hashes, and tags.
- Detect likely secrets before saving unless explicitly allowed.
- Search, list, export, and summarize casefiles offline.
- Keep storage transparent and git-friendly.

## Non-goals

- Cloud sync.
- Background clipboard surveillance.
- Rich binary note taking.

## V1 CLI

```bash
clipcase new bug-login
pbpaste | clipcase add bug-login --source terminal --tag repro
clipcase list
clipcase export bug-login --out case.md
```

## Functional requirements

1. Manage case directories under `.clipcase/` or a configured path.
2. Add entries from stdin and optionally from clipboard on supported platforms with a safe fallback.
3. Store Markdown plus an index JSON with stable IDs, timestamps, tags, hashes, and source labels.
4. Warn/block likely secrets using deterministic regexes unless `--allow-secret` is passed.
5. Provide `new`, `add`, `list`, `show`, `search`, `export`, and `init` commands.
6. Ship fixture-backed tests for capture, secret blocking, search, export, and config behavior.

## Acceptance criteria

- `npm test`, `npm run check`, `npm run build`, and `npm run smoke` pass.
- `bash scripts/validate.sh` passes when present.
- Real CLI smoke creates a casefile from fixture input and exports Markdown.
- README covers quick start, examples, storage format, safety model, limitations, and agent handoff usage.
- Public GitHub repo `rogerchappel/clipcase` has useful description and topics.
