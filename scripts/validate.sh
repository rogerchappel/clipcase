#!/usr/bin/env bash
set -euo pipefail

# release:check owns the complete validation sequence. Keep this script
# standalone and focused on the optional local agent quality-of-life check.
if command -v agent-qc >/dev/null 2>&1; then
  agent-qc ready
else
  echo "agent-qc not installed; skipping"
fi
