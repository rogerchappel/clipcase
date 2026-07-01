# ClipCase

ClipCase is a local-first TypeScript CLI for turning copied context, terminal output, prompts, URLs, and repro notes into tidy Markdown casefiles. It never syncs or phones home; storage is transparent, deterministic, and git-friendly.

## Quick start

```sh
npm install -g clipcase
clipcase init
clipcase new bug-login --title "Login redirect bug"
pbpaste | clipcase add bug-login --source terminal --tag repro
clipcase list
clipcase search redirect
clipcase export bug-login --out case.md
```

Linux and Windows users can pipe text on stdin. `--clipboard` uses `pbpaste`, `xclip`, or PowerShell when available and fails safely when the platform clipboard cannot be read.

## Commands

- `clipcase init [--storage <path>]` creates `.clipcase.json` and the storage directory.
- `clipcase new <case> [--title <title>]` creates a slugged case directory.
- `clipcase add <case> [--source <label>] [--tag <tag>] [--clipboard] [--allow-secret]` stores stdin or clipboard text. Repeat `--tag` or pass comma-separated tags.
- `clipcase list [--json]` prints case name, entry count, updated timestamp, and title.
- `clipcase show <case>` prints deterministic JSON metadata.
- `clipcase search <query> [--json]` searches entry text, tags, and source labels offline.
- `clipcase export <case> [--out <file>]` produces a single Markdown bundle.

## Storage format

By default ClipCase writes to `.clipcase/`. `clipcase init --storage notes/cases` writes `.clipcase.json`. `CLIPCASE_HOME=/tmp/cases` overrides config.

```text
.clipcase/bug-login/
  index.json
  entries/20260101T000100Z-42bb79cf284a.md
```

`index.json` stores stable IDs, timestamps, source labels, tags, hashes, byte counts, and relative Markdown paths. See [docs/STORAGE.md](docs/STORAGE.md) for details.

## Safety model

ClipCase blocks likely secrets before writing content using deterministic regexes for common AWS, GitHub, Slack, private key, and generic token/password assignments. Use `--allow-secret` only when saving sensitive material is intentional.

Limitations: secret detection is conservative, there is no sync or watcher, binary attachments are out of scope, and clipboard commands are platform-dependent.

## Agent handoff usage

```sh
clipcase new failing-test
npm test 2>&1 | clipcase add failing-test --source "npm test" --tag failure
clipcase export failing-test --out handoff.md
```

For a reproducible local demo that creates and verifies a handoff bundle, run:

```sh
bash demo/run-agent-handoff.sh
```

Promotion support drafts live in [docs/promo/video-brief-agent-handoff.md](docs/promo/video-brief-agent-handoff.md)
and [docs/promo/social-hooks.md](docs/promo/social-hooks.md).

## Runnable demo

Run a fixture-backed handoff demo from a clean temporary store:

```sh
npm run build
bash examples/run-agent-handoff-demo.sh
```

The demo creates a case, adds a repro fixture and a failing-test note, searches
the case store, exports Markdown, and verifies the exported handoff.

## Demo and Promotion

- [Agent handoff casefile demo](docs/tutorials/agent-handoff-casefile.md)
- [Video brief](docs/promo/video-brief.md)
- [Social hooks](docs/promo/social-hooks.md)

For a reproducible fixture-backed handoff, run:

```sh
npm run build
bash demo/run-bug-handoff.sh
```

The demo captures repro notes and terminal output from
`examples/bug-handoff`, exports a Markdown handoff, and verifies that
secret-like input is blocked by default.

For a fuller copy-paste support workflow, see
[examples/support-handoff-demo.md](examples/support-handoff-demo.md). A short,
fact-grounded promotion pack lives in
[docs/promo/social-hooks.md](docs/promo/social-hooks.md).

For a searchable support handoff that writes JSON, text, and Markdown artifacts,
run `bash demo/run-search-pack.sh` and follow
[docs/tutorials/searchable-support-handoff.md](docs/tutorials/searchable-support-handoff.md).
The matching recording outline is
[docs/promo/search-pack-video-brief.md](docs/promo/search-pack-video-brief.md).

## Verify

```sh
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Please do not include real secrets in issues or fixtures.

## License

MIT

## Release verification

Run the same checks locally before opening a release PR:

```bash
npm run check
npm test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
```
