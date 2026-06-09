# ClipCase Social Hooks

## Positioning

ClipCase is a local-first CLI for turning copied context, terminal output,
prompts, URLs, and repro notes into Markdown casefiles.

## Short hooks

- Turn a messy clipboard trail into a Markdown handoff without adding a sync
  service.
- Pipe terminal output into `clipcase add`, tag it, search it offline, then
  export one deterministic casefile.
- Useful agent handoffs are often just the right repro notes plus the right
  terminal output. ClipCase keeps both in plain files.

## Demo beats

1. `clipcase init` creates transparent local storage.
2. `clipcase new login-redirect --title "Login redirect repro"` starts a case.
3. `clipcase add` stores piped text with `--source` and `--tag` labels.
4. `clipcase search redirect` finds the relevant entry offline.
5. `clipcase export login-redirect --out handoff.md` produces the shareable
   Markdown bundle.

## Guardrails

- ClipCase is local-first and does not sync cases.
- Secret detection is conservative; review exported casefiles before sharing.
- Binary attachments and background watchers are outside the current scope.
