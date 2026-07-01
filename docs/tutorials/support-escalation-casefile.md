# Support Escalation Casefile

This recipe packages a repro note and terminal failure into a local Markdown
casefile that support, engineering, or an agent handoff can review.

## Run the demo

```sh
npm install
bash demo/run-support-escalation.sh
```

The script builds ClipCase, creates a temporary store, adds two fixture-backed
entries, searches the case, exports Markdown, and verifies expected text in the
handoff.

## Handoff Flow

1. `clipcase init --storage cases` creates local storage.
2. `clipcase new support-escalation --title ...` creates the case.
3. `clipcase add` captures `examples/bug-handoff/repro.txt` with support and
   repro tags.
4. Another `clipcase add` captures `examples/bug-handoff/terminal.txt` as
   terminal failure evidence.
5. `clipcase search dashboard` checks that the case can be found offline.
6. `clipcase export support-escalation --out support-handoff.md` creates the
   shareable Markdown bundle.

## Guardrails

- Review exported Markdown before sharing outside the team.
- Keep real credentials out of fixtures and issue comments.
- Use `--allow-secret` only when saving sensitive text is intentional.
