#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
);
const actualTag = process.env.GITHUB_REF_NAME;
const expectedTag = `v${packageJson.version}`;

if (!actualTag) {
  console.error(`release tag verification failed: GITHUB_REF_NAME is missing; expected ${expectedTag}`);
  process.exit(1);
}

if (actualTag !== expectedTag) {
  console.error(
    `release tag verification failed: tag ${actualTag} does not match package version ${packageJson.version} (expected ${expectedTag})`
  );
  process.exit(1);
}

console.log(`release tag verified: ${actualTag}`);
