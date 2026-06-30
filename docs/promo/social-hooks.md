# ClipCase Social Hooks

Grounded post drafts for the local-first casefile workflow.

## Short Posts

1. ClipCase turns pasted terminal output, repro notes, and prompt context into a deterministic Markdown casefile that stays on disk.
2. Agent handoff recipe: `clipcase new failing-test`, pipe the failure into `clipcase add`, then `clipcase export failing-test --out handoff.md`.
3. ClipCase blocks common secret-shaped input by default, so casefiles can be useful without encouraging accidental token dumps.
4. The storage is transparent: one case directory, JSON metadata, and Markdown entries that are easy to inspect in git.

## Demo Angle

Run:

```sh
npm install
bash demo/run-agent-handoff.sh
```

Show `.tmp/demo-agent-handoff/handoff.md`, then open the case directory to show the plain Markdown entry and deterministic metadata.

## Guardrails

- Do not claim ClipCase is a complete DLP or secrets-scanning product.
- Keep the story on local-first capture, reviewable files, and intentional export.
- Do not use real secrets or private customer data in examples.
