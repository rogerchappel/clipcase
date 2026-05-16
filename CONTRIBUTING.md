# Contributing

Run `npm install`, `npm test`, `npm run check`, `npm run build`, and `npm run smoke` before opening a PR.

Guidelines:

- Keep ClipCase local-first; do not add network calls to core commands.
- Preserve deterministic storage and stable metadata where possible.
- Add tests or fixtures for command behavior, config changes, export output, and secret detection.
- Avoid committing real secrets. Use obviously fake fixtures.
- Prefer small PRs with clear before/after behavior.
