#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

npm run build >/dev/null

cd "$TMP"

node "$ROOT/dist/src/cli.js" init --storage cases
node "$ROOT/dist/src/cli.js" new auth-handoff --title "Auth handoff search pack"

node "$ROOT/dist/src/cli.js" add auth-handoff \
  --source "support repro" \
  --tag auth,repro \
  < "$ROOT/examples/bug-handoff/repro.txt"

node "$ROOT/dist/src/cli.js" add auth-handoff \
  --source "test output" \
  --tag auth,failure \
  < "$ROOT/examples/bug-handoff/terminal.txt"

node "$ROOT/dist/src/cli.js" search dashboard --json > "$TMP/search-dashboard.json"
node "$ROOT/dist/src/cli.js" search "expired login cookie" > "$TMP/search-cookie.txt"
node "$ROOT/dist/src/cli.js" export auth-handoff --out "$TMP/auth-handoff.md"

grep -q '"caseName": "auth-handoff"' "$TMP/search-dashboard.json"
grep -q "auth-handoff" "$TMP/search-cookie.txt"
grep -q "Auth handoff search pack" "$TMP/auth-handoff.md"
grep -q "test output" "$TMP/auth-handoff.md"

echo "Search JSON: $TMP/search-dashboard.json"
echo "Search text: $TMP/search-cookie.txt"
echo "Exported handoff: $TMP/auth-handoff.md"
