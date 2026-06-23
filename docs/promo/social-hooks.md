# Social Hooks

## Short posts

1. ClipCase turns copied context, repro notes, and terminal output into deterministic Markdown casefiles. The new demo exports a complete handoff from a temporary local store.

2. Debugging handoff pattern: `clipcase new`, pipe command output into `clipcase add`, then `clipcase export` a Markdown bundle for review.

3. Local-first casefiles for agents: searchable entries, stable metadata, Markdown exports, and secret blocking before text is stored.

## Demo CTA

```sh
npm run build
bash examples/run-agent-handoff-demo.sh
```

## Grounding facts

- The demo uses `fixtures/repro.txt`.
- Storage is initialized in a temporary directory.
- The exported Markdown is checked for the case title and source label.
