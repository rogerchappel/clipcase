#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$tmp"

node "$repo_root/dist/src/cli.js" init --storage .clipcase
node "$repo_root/dist/src/cli.js" new login-redirect --title "Login redirect loop"
node "$repo_root/dist/src/cli.js" add login-redirect \
  --source repro \
  --tag auth,repro \
  < "$repo_root/examples/bug-handoff/repro.txt"
node "$repo_root/dist/src/cli.js" add login-redirect \
  --source "npm test" \
  --tag failure \
  < "$repo_root/examples/bug-handoff/terminal.txt"

node "$repo_root/dist/src/cli.js" search redirect | grep -q login-redirect
node "$repo_root/dist/src/cli.js" export login-redirect --out handoff.md
grep -q "Login redirect loop" handoff.md
grep -q "clears expired login cookie" handoff.md

if printf 'token=abcdefghijklmnopqrstuvwxyz123456\n' | node "$repo_root/dist/src/cli.js" add login-redirect 2>"$tmp/secret.err"; then
  echo "secret-like input was not blocked" >&2
  exit 1
fi
grep -q "Refusing to save" "$tmp/secret.err"

echo "Demo casefile: $tmp/handoff.md"
