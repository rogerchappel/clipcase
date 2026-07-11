#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

npm --prefix "$ROOT" run build >/dev/null

cd "$TMPDIR"
node "$ROOT/dist/src/cli.js" init --storage .clipcase
node "$ROOT/dist/src/cli.js" new login-redirect --title "Login redirect repro"

node "$ROOT/dist/src/cli.js" add login-redirect \
  --source terminal \
  --tag repro \
  --tag auth < "$ROOT/fixtures/repro.txt"

node "$ROOT/dist/src/cli.js" list | grep -q 'login-redirect'
node "$ROOT/dist/src/cli.js" search expired | grep -q 'login-redirect'
node "$ROOT/dist/src/cli.js" export login-redirect --out handoff.md

grep -q 'Login redirect repro' handoff.md
grep -q 'Steps to reproduce' handoff.md

echo "Demo case exported to $TMPDIR/handoff.md"
sed -n '1,40p' handoff.md
