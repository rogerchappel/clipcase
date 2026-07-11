# Agent Handoff Casefile Demo

This recipe shows how to turn a repro note and a failing command note into one
Markdown handoff bundle. It uses a temporary storage directory, so the
repository checkout stays clean.

## Prerequisites

```sh
npm install
npm run build
```

## Run the demo

```sh
bash demo/run-agent-handoff.sh
```

The script performs the full local flow:

- initializes ClipCase storage in a temporary directory
- creates a `failing-login` case
- adds `fixtures/repro.txt` as a tagged repro entry
- adds a short failing-test note from stdin
- searches for `redirect`
- exports `handoff.md`
- checks that the exported Markdown contains the case title and source label

An alternate example script is available at
`examples/run-agent-handoff-demo.sh`.

## Adapt it

Use the same pattern during a debugging session:

```sh
clipcase new failing-test --title "Failing test handoff"
npm test 2>&1 | clipcase add failing-test --source "npm test" --tag failure
clipcase export failing-test --out handoff.md
```

ClipCase stores text locally and blocks likely secrets unless `--allow-secret` is passed intentionally.
