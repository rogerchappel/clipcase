import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
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

function runResult(args: string[], cwd: string, input?: string) {
  return spawnSync(process.execPath, [cliPath, ...args], { cwd, encoding: 'utf8', input });
}

function runAsync(args: string[], cwd: string, input: string): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cliPath, ...args], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8').on('data', (chunk: string) => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', (chunk: string) => { stderr += chunk; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
    child.stdin.end(input);
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

  it('captures repeated identical input without overwriting an entry', async () => {
    const cwd = await tmp();

    run(['init'], cwd);
    run(['new', 'duplicates'], cwd);
    for (let attempt = 0; attempt < 4; attempt += 1) run(['add', 'duplicates'], cwd, 'identical capture\n');

    const shown = JSON.parse(run(['show', 'duplicates'], cwd)) as { entries: Array<{ id: string; path: string; hash: string; bytes: number }> };
    assert.equal(shown.entries.length, 4);
    assert.equal(new Set(shown.entries.map((entry) => entry.id)).size, 4);
    assert.equal(new Set(shown.entries.map((entry) => entry.path)).size, 4);
    assert.equal(new Set(shown.entries.map((entry) => entry.hash)).size, 1);
    assert.deepEqual(new Set(shown.entries.map((entry) => entry.bytes)), new Set([18]));
    assert.equal(run(['search', 'identical'], cwd).trim().split('\n').length, 4);
    assert.match(run(['export', 'duplicates'], cwd), /- Entries: 4/);
  });

  it('preserves every entry added by concurrent CLI processes', async () => {
    const cwd = await tmp();
    const inputs = Array.from({ length: 12 }, (_, index) => `parallel capture ${String(index).padStart(2, '0')}\n`);

    run(['init'], cwd);
    run(['new', 'concurrent'], cwd);
    const results = await Promise.all(inputs.map((input) => runAsync(['add', 'concurrent', '--source', 'parallel'], cwd, input)));
    for (const result of results) {
      assert.equal(result.code, 0, result.stderr);
      assert.match(result.stdout, /Added .* to concurrent/);
    }

    const shown = JSON.parse(run(['show', 'concurrent'], cwd)) as { entries: Array<{ id: string; path: string }> };
    assert.equal(shown.entries.length, inputs.length);
    assert.equal(new Set(shown.entries.map((entry) => entry.id)).size, inputs.length);
    assert.equal(run(['search', 'parallel capture'], cwd).trim().split('\n').length, inputs.length);
    const exported = run(['export', 'concurrent'], cwd);
    for (const input of inputs) assert.match(exported, new RegExp(input.trim()));
    const entryFiles = (await fs.readdir(path.join(cwd, '.clipcase', 'concurrent', 'entries'))).sort();
    assert.deepEqual(entryFiles, shown.entries.map((entry) => path.basename(entry.path)).sort());
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

  it('rejects unknown options and missing option values with usage', async () => {
    const cwd = await tmp();

    for (const args of [
      ['init', '--storag', 'store'],
      ['init', '--storage'],
      ['new', 'case', '--title'],
      ['add', 'case', '--source'],
      ['add', 'case', '--tag'],
      ['export', 'case', '--out'],
    ]) {
      const result = runResult(args, cwd);
      assert.notEqual(result.status, 0, args.join(' '));
      assert.match(result.stderr, /Usage:/, args.join(' '));
    }
  });

  it('rejects invalid boolean values and command arity errors with usage', async () => {
    const cwd = await tmp();

    for (const args of [
      ['list', '--json=maybe'],
      ['init', 'unexpected'],
      ['list', 'unexpected'],
      ['new'],
      ['new', 'one', 'two'],
      ['show'],
      ['show', 'one', 'two'],
      ['search'],
      ['export'],
      ['export', 'one', 'two'],
    ]) {
      const result = runResult(args, cwd);
      assert.notEqual(result.status, 0, args.join(' '));
      assert.match(result.stderr, /Usage:/, args.join(' '));
    }
  });

  it('accepts equals syntax plus repeated and comma-separated tags', async () => {
    const cwd = await tmp();

    run(['init', '--storage=store'], cwd);
    run(['new', 'valid', '--title=Valid Case'], cwd);
    run(['add', 'valid', '--source=fixture', '--tag=one,two', '--tag', 'three'], cwd, 'documented forms\n');

    const shown = JSON.parse(run(['show', 'valid'], cwd)) as { title: string; entries: Array<{ source: string; tags: string[] }> };
    assert.equal(shown.title, 'Valid Case');
    assert.equal(shown.entries[0].source, 'fixture');
    assert.deepEqual(shown.entries[0].tags, ['one', 'three', 'two']);
    assert.doesNotMatch(run(['list', '--json=false'], cwd), /^\[/);
    assert.match(run(['list', '--json=true'], cwd), /^\[/);
  });
});
