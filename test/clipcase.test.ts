import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { addEntry, createCase, exportCase, listCases, loadCase, readEntryText, searchCases } from '../src/index.js';
import { findSecrets } from '../src/secrets.js';
import { loadConfig, writeConfig } from '../src/config.js';
async function tmp(): Promise<string> { return fs.mkdtemp(path.join(os.tmpdir(), 'clipcase-test-')); }
function cli(cwd: string, ...args: string[]) { return spawnSync(process.execPath, [path.resolve('dist/src/cli.js'), ...args], { cwd, encoding: 'utf8' }); }
test('creates cases and captures deterministic entry metadata', async () => { const dir = await tmp(); await createCase(dir, 'Bug Login', 'Bug Login', new Date('2026-01-01T00:00:00.000Z')); const entry = await addEntry(dir, { caseName: 'bug-login', text: 'hello repro\n', source: 'terminal', tags: ['repro'], now: new Date('2026-01-01T00:01:00.000Z') }); assert.equal(entry.id, '20260101T000100Z-4e17aeaa9041'); assert.equal(entry.source, 'terminal'); assert.deepEqual(entry.tags, ['repro']); });
test('rejects case identifiers that do not produce a meaningful slug', async () => {
  const dir = await tmp();
  const existing = await createCase(dir, 'case', 'Existing Case', new Date('2026-01-01T00:00:00.000Z'));
  const index = path.join(dir, 'case', 'index.json');
  const before = await fs.readFile(index, 'utf8');

  await assert.rejects(() => createCase(dir, '!!!'), /Invalid case name: !!!/);
  await assert.rejects(() => loadCase(dir, '@@@'), /Invalid case name: @@@/);
  await assert.rejects(() => addEntry(dir, { caseName: '###', text: 'must not be saved' }), /Invalid case name: ###/);

  assert.equal(await fs.readFile(index, 'utf8'), before);
  assert.deepEqual(await fs.readdir(path.join(dir, 'case', 'entries')), []);
  assert.deepEqual(await loadCase(dir, 'case'), existing);
});
test('keeps identical same-second captures as distinct, ordered entries', async () => { const dir = await tmp(); await createCase(dir, 'collision'); const now = new Date('2026-01-01T00:00:01.100Z'); const first = await addEntry(dir, { caseName: 'collision', text: 'same content', now }); const second = await addEntry(dir, { caseName: 'collision', text: 'same content', now: new Date('2026-01-01T00:00:01.900Z') }); assert.equal(first.id, '20260101T000001Z-a636bd7cd420'); assert.equal(second.id, `${first.id}-000001`); assert.notEqual(first.path, second.path); const meta = await loadCase(dir, 'collision'); assert.deepEqual(meta.entries.map((entry) => entry.id), [first.id, second.id]); assert.deepEqual(meta.entries.map((entry) => entry.hash), [first.hash, first.hash]); assert.deepEqual(meta.entries.map((entry) => entry.bytes), [12, 12]); assert.equal((await searchCases(dir, 'same content')).length, 2); const exported = await exportCase(dir, 'collision'); assert.ok(exported.indexOf(`## ${first.id}\n`) < exported.indexOf(`## ${second.id}\n`)); });
test('blocks likely secrets unless explicitly allowed', async () => { const dir = await tmp(); await createCase(dir, 'secret-case'); await assert.rejects(() => addEntry(dir, { caseName: 'secret-case', text: 'token=abcdefghijklmnopqrstuvwxyz123456' }), /Refusing to save/); const entry = await addEntry(dir, { caseName: 'secret-case', text: 'token=abcdefghijklmnopqrstuvwxyz123456', allowSecret: true }); assert.ok(entry.id); assert.equal(findSecrets('AKIAABCDEFGHIJKLMNOP').length, 1); assert.equal(findSecrets('npm_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKL').length, 1); });
test('lists, searches, and exports case content', async () => { const dir = await tmp(); await createCase(dir, 'bug-login', 'Login Bug'); await addEntry(dir, { caseName: 'bug-login', text: 'expired cookie causes failure', source: 'terminal', tags: ['auth'] }); assert.equal((await listCases(dir)).length, 1); const results = await searchCases(dir, 'cookie'); assert.equal(results.length, 1); const exported = await exportCase(dir, 'bug-login'); assert.match(exported, /# Login Bug/); assert.match(exported, /expired cookie/); });
test('distinguishes missing, malformed, and unreadable case indexes', async () => {
  const dir = await tmp();
  await assert.rejects(() => loadCase(dir, 'missing'), (error: unknown) => error instanceof Error && error.message === 'Case not found: missing');
  await createCase(dir, 'malformed');
  await fs.writeFile(path.join(dir, 'malformed', 'index.json'), '{broken');
  await assert.rejects(() => loadCase(dir, 'malformed'), /Invalid case metadata for malformed .*index\.json/);
  await fs.mkdir(path.join(dir, 'unreadable', 'index.json'), { recursive: true });
  await assert.rejects(() => loadCase(dir, 'unreadable'), /Cannot read case metadata for unreadable .*index\.json/);
  await assert.rejects(() => listCases(dir), /Invalid case metadata for malformed/);
});
test('CLI list and show report corrupt metadata while missing show keeps exit 2', async () => {
  const cwd = await tmp();
  await writeConfig('.clipcase', cwd);
  const storage = path.join(cwd, '.clipcase');
  await createCase(storage, 'broken');
  await fs.writeFile(path.join(storage, 'broken', 'index.json'), '{broken');
  const list = cli(cwd, 'list');
  assert.equal(list.status, 4);
  assert.match(list.stderr, /Invalid case metadata for broken .*index\.json/);
  const show = cli(cwd, 'show', 'broken');
  assert.equal(show.status, 4);
  assert.match(show.stderr, /Invalid case metadata for broken .*index\.json/);
  const missing = cli(cwd, 'show', 'missing');
  assert.equal(missing.status, 2);
  assert.equal(missing.stderr, 'Case not found: missing\n');
});
test('round-trips arbitrary entry text and safely serializes metadata', async () => {
  const dir = await tmp();
  await createCase(dir, 'hostile-markdown');
  const text = 'before\n```\nmiddle\n`````text\nafter\n';
  const source = 'terminal\nforged: field [link](https://example.test), "quoted"';
  const tags = ['comma, tag', 'brackets [x]', 'quote " and ` tick', 'line\nbreak'];
  const entry = await addEntry(dir, { caseName: 'hostile-markdown', text, source, tags });
  const meta = await loadCase(dir, 'hostile-markdown');
  const stored = await fs.readFile(path.join(dir, 'hostile-markdown', entry.path), 'utf8');

  assert.equal(await readEntryText(dir, meta, entry), text);
  assert.equal(JSON.parse(stored.match(/^source: (.*)$/m)?.[1] ?? ''), source);
  assert.deepEqual(JSON.parse(stored.match(/^tags: (.*)$/m)?.[1] ?? ''), [...tags].sort());
  assert.match(stored, /\n``````text\n/);

  const exported = await exportCase(dir, 'hostile-markdown');
  assert.match(exported, /- Source: `terminal\\nforged: field \[link\]\(https:\/\/example\.test\), \\"quoted\\"`/);
  assert.match(exported, /- Tags: `brackets \[x\]` `comma, tag` `line\\nbreak` ``quote \\" and ` tick``/);
  assert.match(exported, /\n``````text\nbefore\n```\nmiddle\n`````text\nafter\n``````\n/);
});
test('writes and loads local config', async () => { const dir = await tmp(); await writeConfig('notes', dir); const config = await loadConfig(dir); assert.equal(config.storageDir, path.join(dir, 'notes')); });
