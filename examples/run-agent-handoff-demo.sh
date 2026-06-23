#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$TMP_DIR"

node "$ROOT_DIR/dist/src/cli.js" init --storage cases
node "$ROOT_DIR/dist/src/cli.js" new failing-login --title "Login redirect regression"

node "$ROOT_DIR/dist/src/cli.js" add failing-login \
  --source "terminal repro" \
  --tag repro \
  <"$ROOT_DIR/fixtures/repro.txt"

printf '%s\n' 'npm test failed in auth redirect suite' \
  | node "$ROOT_DIR/dist/src/cli.js" add failing-login --source "npm test" --tag failure

node "$ROOT_DIR/dist/src/cli.js" list
node "$ROOT_DIR/dist/src/cli.js" search redirect
node "$ROOT_DIR/dist/src/cli.js" export failing-login --out handoff.md

grep -q "Login redirect regression" handoff.md
grep -q "terminal repro" handoff.md
wc -c handoff.md
