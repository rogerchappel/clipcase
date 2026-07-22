import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cliPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/cli.js');

async function tmp(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'clipcase-cli-test-'));
}

function run(args: string[], cwd: string, input?: string): string {
  return execFileSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
    input,
  });
}

describe('clipcase CLI', () => {
  it('prints current casefile commands in help output', async () => {
    const cwd = await tmp();
    const out = run(['help'], cwd);

    assert.match(out, /clipcase init/);
    assert.match(out, /clipcase add/);
    assert.match(out, /clipcase export/);
  });

  it('creates, lists, searches, and exports a casefile', async () => {
    const cwd = await tmp();

    assert.match(run(['init'], cwd), /Initialized/);
    assert.match(run(['new', 'bug-login', '--title', 'Login Bug'], cwd), /Created case bug-login/);
    assert.match(
      run(['add', 'bug-login', '--source', 'fixture', '--tag', 'repro'], cwd, 'expired cookie causes redirect failure\n'),
      /Added .* to bug-login/,
    );

    assert.match(run(['list'], cwd), /bug-login/);
    assert.match(run(['search', 'cookie'], cwd), /bug-login/);
    assert.match(run(['export', 'bug-login'], cwd), /expired cookie causes redirect failure/);
  });

  it('rejects case names that resolve outside the configured store', async () => {
    const cwd = await tmp();

    run(['init', '--storage', 'store'], cwd);
    const result = spawnSync(process.execPath, [cliPath, 'new', '..'], { cwd, encoding: 'utf8' });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Invalid case name/);
    await assert.rejects(fs.access(path.join(cwd, 'index.json')));
    await assert.rejects(fs.access(path.join(cwd, 'store', 'index.json')));
    assert.match(run(['new', 'normal-case'], cwd), /Created case normal-case/);
    await fs.access(path.join(cwd, 'store', 'normal-case', 'index.json'));
  });

  it('rejects unknown commands with usage', async () => {
    const cwd = await tmp();

    assert.throws(
      () => run(['convert', 'helloWorld', 'snake'], cwd),
      /Unknown command: convert/,
    );
  });
});
