#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const releaseWorkflow = await readFile(
  new URL("../.github/workflows/release.yml", import.meta.url),
  "utf8"
);

const claimsRegistryInstall = /npm\s+(?:i|install)\s+(?:--global|-g)\s+clipcase(?:@\S+)?(?:\s|$)/m.test(
  readme
);
const publishesToRegistry = /(?:^|\s)npm\s+publish(?:\s|$)/m.test(releaseWorkflow);

if (claimsRegistryInstall && !publishesToRegistry) {
  console.error(
    "release contract failed: README claims a registry install, but the release workflow does not publish to npm"
  );
  process.exit(1);
}

const documentsTarballRelease =
  /attach(?:es|ed|ing)? it to a GitHub\s+release/i.test(readme) &&
  /do(?:es)? not publish ClipCase to the npm registry/i.test(readme);

if (!publishesToRegistry && !documentsTarballRelease) {
  console.error(
    "release contract failed: README must explain that tags create GitHub tarball releases without npm publication"
  );
  process.exit(1);
}

console.log(
  publishesToRegistry
    ? "release contract passed with npm publication enabled"
    : "release contract passed for GitHub tarball releases"
);
