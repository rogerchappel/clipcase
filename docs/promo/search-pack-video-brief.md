# Video Brief: Searchable Support Handoff Pack

## Angle

Show ClipCase as a local way to turn scattered repro notes and terminal output
into one searchable casefile before handing work to an engineer or agent.

## Demo flow

1. Run `npm run build`.
2. Run `bash demo/run-search-pack.sh`.
3. Point out the three generated artifacts: JSON search output, text search
   output, and the exported Markdown handoff.
4. Open the exported handoff and show that it preserves the repro source label,
   test output source label, tags, and case title.

## Voiceover points

- ClipCase stores casefiles locally; the demo uses a temporary `cases` store.
- Search works across saved entry text, not just case titles.
- The export is plain Markdown, so it can be pasted into an issue, PR, or agent
  handoff without a hosted service.

## Guardrails

- Do not describe ClipCase as a ticketing system or sync product.
- Do not claim perfect secret detection; keep the claim to default blocking of
  known secret-like patterns.
- Use the checked-in `examples/bug-handoff` fixtures as the proof source.
