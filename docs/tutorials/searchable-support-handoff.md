# Searchable Support Handoff

This recipe shows how to collect a support repro and terminal output into a
local case, search it, and export a Markdown handoff.

## Run it

```sh
npm run build
bash demo/run-search-pack.sh
```

The script creates a temporary store, adds the checked-in
`examples/bug-handoff/repro.txt` and `examples/bug-handoff/terminal.txt`
fixtures, then writes:

- `search-dashboard.json` for a JSON search result.
- `search-cookie.txt` for a text search result.
- `auth-handoff.md` for the exported handoff.

## What to review

- The JSON search includes `auth-handoff` as the case name.
- The text search finds the expired cookie detail from the repro fixture.
- The Markdown export keeps the case title and source labels so the receiver can
  tell repro notes from test output.

## When to use it

Use this workflow when you have copied context from chat, a terminal, and a
short repro note, and you need one deterministic Markdown artifact for a GitHub
issue, PR, or agent handoff.
