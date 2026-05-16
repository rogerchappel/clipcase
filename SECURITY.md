# Security Policy

ClipCase is a local-first CLI. It should not transmit captured content over the network.

Report security issues privately to the repository owner. Do not open public issues containing secrets, tokens, private logs, or exploit details.

ClipCase blocks common secret patterns before writing entries unless `--allow-secret` is provided. This is a safety net, not a guarantee. Treat saved casefiles as sensitive when they contain terminal output, prompts, or customer data.

Supported line: `0.1.x`.
