# Support Handoff Demo

This recipe turns a copied repro note and terminal output into a single
Markdown casefile. It uses temporary storage so the demo does not affect your
regular ClipCase cases.

## Setup

```sh
npm install
npm run build
rm -rf /tmp/clipcase-demo
mkdir -p /tmp/clipcase-demo
```

## Run the demo

Initialize a local case store:

```sh
CLIPCASE_HOME=/tmp/clipcase-demo node dist/src/cli.js init --storage /tmp/clipcase-demo/cases
```

Create a case:

```sh
CLIPCASE_HOME=/tmp/clipcase-demo node dist/src/cli.js new login-redirect --title "Login redirect repro"
```

Add repro notes from stdin:

```sh
printf "Steps: submit login form, observe redirect loop\nExpected: dashboard\nActual: /login reloads\n" \
  | CLIPCASE_HOME=/tmp/clipcase-demo node dist/src/cli.js add login-redirect --source repro-note --tag repro
```

Add terminal output:

```sh
printf "npm test\nFAIL auth redirects after callback\n" \
  | CLIPCASE_HOME=/tmp/clipcase-demo node dist/src/cli.js add login-redirect --source "npm test" --tag terminal
```

Search and export the handoff:

```sh
CLIPCASE_HOME=/tmp/clipcase-demo node dist/src/cli.js search redirect
CLIPCASE_HOME=/tmp/clipcase-demo node dist/src/cli.js export login-redirect --out /tmp/clipcase-demo/handoff.md
```

## Expected proof points

- `list` shows the case with two entries.
- `search redirect` finds the repro entry offline.
- `/tmp/clipcase-demo/handoff.md` contains deterministic metadata and the
  captured Markdown entries.

## Cleanup

```sh
rm -rf /tmp/clipcase-demo
```
