# Storage format

ClipCase stores plain files so users can inspect, diff, back up, or delete casefiles without the CLI.

- `.clipcase.json` optionally points commands at a storage directory.
- Each case directory is named with the case slug.
- `index.json` contains case metadata and entry metadata.
- `entries/*.md` contains front matter, hash metadata, and fenced plaintext.

Entry IDs are timestamp plus content hash prefix: `YYYYMMDDTHHMMSSZ-<12 hex>`.
