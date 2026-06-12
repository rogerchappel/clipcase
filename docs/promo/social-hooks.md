# ClipCase Social Hooks

Draft posts grounded in ClipCase's current local CLI behavior: transparent
`.clipcase` storage, deterministic Markdown export, offline search, and
conservative secret blocking.

## Short posts

1. ClipCase turns scattered repro notes, terminal output, and copied context into
   a git-friendly Markdown casefile without syncing anything.
2. Pipe a failed command into `clipcase add`, tag it, then export a single
   handoff Markdown file for the next reviewer or agent.
3. The default safety model is local-first: no watcher, no hosted service, and
   likely secrets are blocked unless you explicitly allow them.

## Demo angle

Run the bug-handoff demo:

```sh
npm run build
bash demo/run-bug-handoff.sh
```

The script creates a temporary case, captures repro and terminal fixtures,
exports `handoff.md`, verifies key text, and confirms secret-like input is
blocked.

