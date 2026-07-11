#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

npm run build

cd "$TMP"

node "$ROOT/dist/src/cli.js" init --storage cases
node "$ROOT/dist/src/cli.js" new support-escalation --title "Login redirect support escalation"

node "$ROOT/dist/src/cli.js" add support-escalation \
  --source "customer repro" \
  --tag support,repro \
  < "$ROOT/examples/bug-handoff/repro.txt"

node "$ROOT/dist/src/cli.js" add support-escalation \
  --source "npm test" \
  --tag failure,terminal \
  < "$ROOT/examples/bug-handoff/terminal.txt"

node "$ROOT/dist/src/cli.js" list | tee "$TMP/list.txt"
node "$ROOT/dist/src/cli.js" search dashboard | tee "$TMP/search.txt"
node "$ROOT/dist/src/cli.js" export support-escalation --out "$TMP/support-handoff.md"

grep -q "support-escalation" "$TMP/list.txt"
grep -q "customer repro" "$TMP/search.txt"
grep -q "Login redirect support escalation" "$TMP/support-handoff.md"
grep -q "not ok 3" "$TMP/support-handoff.md"

echo "Demo casefile verified at $TMP/support-handoff.md"
