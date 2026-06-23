#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT
cd "$TMPDIR"
node "$ROOT/dist/src/cli.js" init --storage .clipcase
node "$ROOT/dist/src/cli.js" new bug-login --title "Login Bug"
cat "$ROOT/fixtures/repro.txt" | node "$ROOT/dist/src/cli.js" add bug-login --source fixture --tag repro
node "$ROOT/dist/src/cli.js" list | grep bug-login
node "$ROOT/dist/src/cli.js" list --json | grep "bug-login"
node "$ROOT/dist/src/cli.js" search expired | grep bug-login
node "$ROOT/dist/src/cli.js" export bug-login --out case.md
grep "Login Bug" case.md
grep "Steps to reproduce" case.md
if cat "$ROOT/fixtures/secret.txt" | node "$ROOT/dist/src/cli.js" add bug-login 2>/tmp/clipcase-secret.err; then
  echo "secret fixture was not blocked" >&2
  exit 1
fi
grep "Refusing to save" /tmp/clipcase-secret.err
