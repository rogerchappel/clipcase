#!/usr/bin/env bash
set -euo pipefail
if command -v agent-qc >/dev/null 2>&1; then agent-qc ready; else echo "agent-qc not installed; skipping"; fi
