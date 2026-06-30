#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/.tmp/demo-agent-handoff"

rm -rf "$OUT"
mkdir -p "$OUT"

npm run build

cd "$OUT"
node "$ROOT/dist/src/cli.js" init --storage .clipcase
node "$ROOT/dist/src/cli.js" new failing-test --title "Failing test handoff"

cat > repro.txt <<'EOF'
Command: npm test
Exit: 1

Failure:
  Expected login redirect to preserve next=/settings.
  Actual redirect dropped the next parameter.

Next useful check:
  npm test -- login-redirect
EOF

node "$ROOT/dist/src/cli.js" add failing-test --source "npm test" --tag failure < repro.txt
node "$ROOT/dist/src/cli.js" list
node "$ROOT/dist/src/cli.js" search redirect
node "$ROOT/dist/src/cli.js" export failing-test --out handoff.md

grep -q "Failing test handoff" handoff.md
grep -q "npm test" handoff.md
grep -q "next=/settings" handoff.md

echo
echo "Demo artifacts written to $OUT"
echo "  $OUT/handoff.md"
