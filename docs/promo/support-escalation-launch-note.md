# Launch Note Draft: Support Escalation Casefiles

ClipCase now has a runnable support escalation demo for turning repro notes and
terminal output into a deterministic Markdown handoff.

## What is included

- `demo/run-support-escalation.sh` builds the CLI and runs the full flow in a
  temporary local store.
- The demo captures `examples/bug-handoff/repro.txt` and
  `examples/bug-handoff/terminal.txt`.
- The script verifies `list`, `search`, and `export` outputs before reporting
  the generated handoff path.

## Suggested Announcement

When a support issue needs engineering context, ClipCase can turn the repro note
and terminal output into one local Markdown casefile. Run the support escalation
demo to see the full flow without touching your normal case store:

```sh
npm run build
bash demo/run-support-escalation.sh
```

## Limitations to mention

- ClipCase is local-first; it does not sync or host casefiles.
- Secret detection is conservative and should not replace human review.
- Binary attachments and background capture are outside the current scope.
