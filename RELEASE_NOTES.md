# ClipCase 0.1.0 Release Notes

ClipCase is ready for its initial public build as a local-first clipboard-to-casefile CLI.

## Highlights

- Provides a TypeScript CLI for creating deterministic Markdown evidence bundles from stdin or clipboard input.
- Stores casefiles locally in transparent, git-friendly directories with stable JSON metadata.
- Includes offline search, case listing, case export, and deterministic secret checks before writing captured content.
- Ships documentation for storage format, CLI usage, contributing, security, and project roadmap.

## Verification

- `npm run release:check`
- `releasebox check`
- `releasebox notes`

## Release Scope

- Package: `clipcase`
- Version: `0.1.0`
- Publish target: reviewed GitHub release; npm publishing disabled in releasebox config.
