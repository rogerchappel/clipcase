# Orchestration

Workstreams: product contract, core implementation, quality gates, and publishing setup.

CI runs `npx --yes npm@10.9.4 ci` followed by `npx --yes npm@10.9.4 run release:check` on Node.js 20, 22, and 24. The `release:check` script runs tests, type-checking, build, CLI smoke, package smoke, release-contract checks, and finally `bash scripts/validate.sh`; CI does not invoke that validation script as a separate workflow step. The runtime matrix is defined in `.github/workflows/ci.yml`, and the gate sequence in `package.json`.

For a local CI-equivalent run, use `npx --yes npm@10.9.4 ci` then `npx --yes npm@10.9.4 run release:check` on each supported Node.js runtime. `bash scripts/validate.sh` is also available as the final sub-check, but running it alone is not equivalent to the complete CI gate.

Release posture: usable MVP at `0.1.0`; publishing remains explicit and validation-first.
