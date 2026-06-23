# Video Brief: Turn Terminal Context Into a Markdown Handoff

## Viewer

Developers and agents who need to preserve repro notes, command output, and search-friendly context without syncing private clipboard history.

## Demo arc

1. Start with a short repro note in `fixtures/repro.txt`.
2. Run `npm run build`.
3. Run `bash examples/run-agent-handoff-demo.sh`.
4. Show the temporary case storage, search output, and generated `handoff.md` checks.
5. Mention the default secret guard and the explicit `--allow-secret` escape hatch.

## On-screen commands

```sh
npm run build
bash examples/run-agent-handoff-demo.sh
clipcase export failing-test --out handoff.md
```

## Honest limitations

- ClipCase stores Markdown text, not binary attachments.
- Clipboard reads depend on platform tools; stdin works everywhere.
- There is no sync, watcher, or hosted account.
