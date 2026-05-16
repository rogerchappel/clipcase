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
- `clipcase add <case> [--source <label>] [--tag <tag>] [--clipboard] [--allow-secret]` stores stdin or clipboard text.
- `clipcase list` prints case name, entry count, updated timestamp, and title.
- `clipcase show <case>` prints deterministic JSON metadata.
- `clipcase search <query>` searches entry text, tags, and source labels offline.
- `clipcase export <case> [--out <file>]` produces a single Markdown bundle.

## Storage format

By default ClipCase writes to `.clipcase/`. `clipcase init --storage notes/cases` writes `.clipcase.json`. `CLIPCASE_HOME=/tmp/cases` overrides config.

```text
.clipcase/bug-login/
  index.json
  entries/20260101T000100Z-42bb79cf284a.md
```

`index.json` stores stable IDs, timestamps, source labels, tags, hashes, byte counts, and relative Markdown paths.

## Safety model

ClipCase blocks likely secrets before writing content using deterministic regexes for common AWS, GitHub, Slack, private key, and generic token/password assignments. Use `--allow-secret` only when saving sensitive material is intentional.

Limitations: secret detection is conservative, there is no sync or watcher, binary attachments are out of scope, and clipboard commands are platform-dependent.

## Agent handoff usage

```sh
clipcase new failing-test
npm test 2>&1 | clipcase add failing-test --source "npm test" --tag failure
clipcase export failing-test --out handoff.md
```

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
