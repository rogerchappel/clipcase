# Build An Agent Handoff Casefile

This walkthrough uses the checked-in repro fixture to create a local ClipCase case, search it, and export a Markdown handoff.

## Run The Demo

```sh
bash demo/run-agent-handoff.sh
```

The script builds the CLI, creates a temporary `.clipcase` store, adds `fixtures/repro.txt`, searches for `expired`, and exports `handoff.md`.

## Manual Steps

```sh
npm run build
tmpdir="$(mktemp -d)"
cd "$tmpdir"
node /path/to/clipcase/dist/src/cli.js init --storage .clipcase
node /path/to/clipcase/dist/src/cli.js new login-redirect --title "Login redirect repro"
node /path/to/clipcase/dist/src/cli.js add login-redirect --source terminal --tag repro < /path/to/clipcase/fixtures/repro.txt
node /path/to/clipcase/dist/src/cli.js search expired
node /path/to/clipcase/dist/src/cli.js export login-redirect --out handoff.md
```

## What To Show

- The case name, title, source label, and tags are preserved in the exported Markdown.
- Search works offline against the saved entry text.
- The demo uses a temporary directory and does not sync content anywhere.

## Verification

The demo checks that the case appears in `clipcase list`, that search returns the case, and that the exported Markdown contains the title and repro heading.
