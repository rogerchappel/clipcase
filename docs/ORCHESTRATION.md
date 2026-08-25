# Orchestration

Workstreams: product contract, core implementation, quality gates, and publishing setup.

Verification gates: `npx --yes npm@10.9.4 ci`, `npx --yes npm@10.9.4 run release:check`, `bash scripts/validate.sh`, and a real fixture-backed CLI smoke on supported Node.js 20, 22, and 24 runtimes.

Release posture: usable MVP at `0.1.0`; publishing remains explicit and validation-first.
