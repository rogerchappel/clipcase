# Video Brief: Agent Handoff Casefile

## Promise

Show how ClipCase turns a failing command and repro notes into a local Markdown handoff that another human or agent can inspect.

## Demo Path

1. Open `demo/run-agent-handoff.sh`.
2. Run `bash demo/run-agent-handoff.sh`.
3. Open `.tmp/demo-agent-handoff/handoff.md`.
4. Show `.tmp/demo-agent-handoff/.clipcase/failing-test/index.json`.
5. Run `node dist/src/cli.js search redirect` from the demo output directory.

## On-Screen Commands

```sh
npm install
bash demo/run-agent-handoff.sh
```

## Talk Track

- "ClipCase stores pasted context as local files, not a hosted workspace."
- "Each entry keeps source labels, tags, hashes, and timestamps in metadata."
- "Export creates one Markdown bundle for issues, PRs, or agent handoff."

## Boundaries

- Secret detection is conservative and pattern-based.
- Clipboard support depends on the host platform; stdin works everywhere.
- Binary attachments and syncing are intentionally out of scope.
