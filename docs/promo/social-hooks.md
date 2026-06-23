# ClipCase Social Hooks

ClipCase is a local-first CLI for turning copied context, terminal output,
prompts, URLs, and repro notes into Markdown casefiles. Draft posts should stay
grounded in current CLI behavior: transparent `.clipcase` storage,
deterministic Markdown export, offline search, and conservative secret
blocking.

## Short posts

1. ClipCase turns copied context, repro notes, and terminal output into deterministic Markdown casefiles. The new demo exports a complete handoff from a temporary local store.

2. Debugging handoff pattern: `clipcase new`, pipe command output into `clipcase add`, then `clipcase export` a Markdown bundle for review.

3. Local-first casefiles for agents: searchable entries, stable metadata, Markdown exports, and secret blocking before text is stored.

## Demo CTA

```sh
npm run build
bash examples/run-agent-handoff-demo.sh
```

## Grounding facts

- The demo uses `fixtures/repro.txt`.
- Storage is initialized in a temporary directory.
- The exported Markdown is checked for the case title and source label.

## Short hooks

- Turn a messy clipboard trail into a Markdown handoff without adding a sync
  service.
- Pipe terminal output into `clipcase add`, tag it, search it offline, then
  export one deterministic casefile.
- Useful agent handoffs are often just the right repro notes plus the right
  terminal output. ClipCase keeps both in plain files.
- The default safety model is local-first: no watcher, no hosted service, and
  likely secrets are blocked unless you explicitly allow them.

## Demo beats

1. `clipcase init` creates transparent local storage.
2. `clipcase new login-redirect --title "Login redirect repro"` starts a case.
3. `clipcase add` stores piped text with `--source` and `--tag` labels.
4. `clipcase search redirect` finds the relevant entry offline.
5. `clipcase export login-redirect --out handoff.md` produces the shareable
   Markdown bundle.

## Fixture-backed demo

```sh
npm run build
bash demo/run-bug-handoff.sh
```

The script creates a temporary case, captures repro and terminal fixtures,
exports `handoff.md`, verifies key text, and confirms secret-like input is
blocked.

## Guardrails

- ClipCase is local-first and does not sync cases.
- Secret detection is conservative; review exported casefiles before sharing.
- Binary attachments and background watchers are outside the current scope.
