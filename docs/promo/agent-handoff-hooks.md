# Agent Handoff Hooks

Grounded promotion notes for the fixture-backed ClipCase handoff demo.

## Short Posts

1. ClipCase turns pasted terminal output and repro notes into a deterministic Markdown casefile you can hand to another human or agent.
2. The demo stores `fixtures/repro.txt`, tags it as an auth repro, searches it offline, and exports a shareable `handoff.md`.
3. No sync, no account, no background watcher: `clipcase init`, `clipcase add`, `clipcase search`, and `clipcase export` are local filesystem operations.
4. Use `bash demo/run-agent-handoff.sh` to see the casefile flow without touching your real clipboard or notes.

## Video Beat

- Open `fixtures/repro.txt`.
- Run `bash demo/run-agent-handoff.sh`.
- Show the `clipcase list` and `clipcase search expired` checks from the script.
- Show the top of the exported Markdown handoff.
- Close on the local-first safety model and secret-blocking behavior in the README.

## Guardrails

- Do not claim ClipCase replaces issue trackers or incident tools.
- Do not include real secrets in demo content.
- Keep claims limited to local storage, deterministic metadata, offline search, and Markdown export.
