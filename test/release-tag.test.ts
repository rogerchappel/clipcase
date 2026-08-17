import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const verifier = resolve('scripts/verify-release-tag.mjs');
const packageVersion = JSON.parse(readFileSync(resolve('package.json'), 'utf8')).version as string;
const expectedTag = `v${packageVersion}`;

function verifyTag(tag?: string) {
  const env = { ...process.env };
  if (tag === undefined) delete env.GITHUB_REF_NAME;
  else env.GITHUB_REF_NAME = tag;
  return spawnSync(process.execPath, [verifier], { encoding: 'utf8', env });
}

test('release tag verifier accepts the package version tag', () => {
  const result = verifyTag(expectedTag);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`release tag verified: ${expectedTag.replaceAll('.', '\\.')}`));
});

test('release tag verifier rejects a tag that differs from the package version', () => {
  const mismatchedTag = `${expectedTag}-mismatch`;
  const result = verifyTag(mismatchedTag);
  assert.equal(result.status, 1);
  assert.match(result.stderr, new RegExp(`tag ${mismatchedTag.replaceAll('.', '\\.')} does not match package version ${packageVersion.replaceAll('.', '\\.')}`));
});

test('release tag verifier rejects a missing GitHub tag', () => {
  const result = verifyTag();
  assert.equal(result.status, 1);
  assert.match(result.stderr, new RegExp(`GITHUB_REF_NAME is missing; expected ${expectedTag.replaceAll('.', '\\.')}`));
});
