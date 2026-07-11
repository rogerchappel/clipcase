#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

npm --prefix "$ROOT" run build >/dev/null

cd "$TMPDIR"
node "$ROOT/dist/src/cli.js" init --storage .clipcase
node "$ROOT/dist/src/cli.js" new failing-login --title "Failing login handoff"

node "$ROOT/dist/src/cli.js" add failing-login \
  --source terminal \
  --tag repro \
  --tag auth < "$ROOT/fixtures/repro.txt"

cat > repro.txt <<'EOF'
Command: npm test
Exit: 1

Failure:
  Expected login redirect to preserve next=/settings.
  Actual redirect dropped the next parameter.

Next useful check:
  npm test -- login-redirect
EOF

node "$ROOT/dist/src/cli.js" add failing-login --source "npm test" --tag failure < repro.txt
node "$ROOT/dist/src/cli.js" list | grep -q 'failing-login'
node "$ROOT/dist/src/cli.js" search redirect | grep -q 'failing-login'
node "$ROOT/dist/src/cli.js" export failing-login --out handoff.md

grep -q "Failing login handoff" handoff.md
grep -q "npm test" handoff.md
grep -q "next=/settings" handoff.md

echo "Demo case exported to $TMPDIR/handoff.md"
sed -n '1,40p' handoff.md
