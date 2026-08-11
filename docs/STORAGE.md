# Storage format

ClipCase stores plain files so users can inspect, diff, back up, or delete casefiles without the CLI.

- `.clipcase.json` optionally points commands at a storage directory.
- Each case directory is named with the case slug.
- `index.json` contains case metadata and entry metadata.
- `entries/*.md` contains front matter, hash metadata, and fenced plaintext.

Entry front matter uses JSON-compatible YAML scalars for string values and the
tag array. This keeps multiline labels and punctuation such as commas, brackets,
and quotes inside their original values. Human-readable source and tag labels are
likewise rendered as escaped Markdown code spans.

The plaintext fence is at least three backticks and is always one backtick longer
than the longest run found in the captured text. Readers use the indexed byte
length to recover the exact capture, including whether it ended with a newline.
Older entries that use the original fixed triple-backtick fence remain readable.

Entry IDs are timestamp plus content hash prefix: `YYYYMMDDTHHMMSSZ-<12 hex>`.
If that ID already exists, ClipCase appends a zero-padded collision counter, starting
at `-000001`. This preserves both identical captures made within the same second
while keeping filenames and index ordering deterministic.

## Concurrent writers

Adds to the same case are serialized with a case-local `.index.lock` directory.
A writer retries every 25 ms for up to 10 seconds, then exits with an error rather
than overwriting another writer's metadata. `index.json` is written to a temporary
file and atomically renamed, so readers see either the previous complete index or
the new complete index, never a partially written JSON document.
