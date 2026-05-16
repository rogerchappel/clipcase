import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { addEntry, createCase, exportCase, listCases, searchCases } from '../src/index.js';
import { findSecrets } from '../src/secrets.js';
import { loadConfig, writeConfig } from '../src/config.js';
async function tmp(): Promise<string> { return fs.mkdtemp(path.join(os.tmpdir(), 'clipcase-test-')); }
test('creates cases and captures deterministic entry metadata', async () => { const dir = await tmp(); await createCase(dir, 'Bug Login', 'Bug Login', new Date('2026-01-01T00:00:00.000Z')); const entry = await addEntry(dir, { caseName: 'bug-login', text: 'hello repro\n', source: 'terminal', tags: ['repro'], now: new Date('2026-01-01T00:01:00.000Z') }); assert.equal(entry.id, '20260101T000100Z-4e17aeaa9041'); assert.equal(entry.source, 'terminal'); assert.deepEqual(entry.tags, ['repro']); });
test('blocks likely secrets unless explicitly allowed', async () => { const dir = await tmp(); await createCase(dir, 'secret-case'); await assert.rejects(() => addEntry(dir, { caseName: 'secret-case', text: 'token=abcdefghijklmnopqrstuvwxyz123456' }), /Refusing to save/); const entry = await addEntry(dir, { caseName: 'secret-case', text: 'token=abcdefghijklmnopqrstuvwxyz123456', allowSecret: true }); assert.ok(entry.id); assert.equal(findSecrets('AKIAABCDEFGHIJKLMNOP').length, 1); assert.equal(findSecrets('npm_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKL').length, 1); });
test('lists, searches, and exports case content', async () => { const dir = await tmp(); await createCase(dir, 'bug-login', 'Login Bug'); await addEntry(dir, { caseName: 'bug-login', text: 'expired cookie causes failure', source: 'terminal', tags: ['auth'] }); assert.equal((await listCases(dir)).length, 1); const results = await searchCases(dir, 'cookie'); assert.equal(results.length, 1); const exported = await exportCase(dir, 'bug-login'); assert.match(exported, /# Login Bug/); assert.match(exported, /expired cookie/); });
test('writes and loads local config', async () => { const dir = await tmp(); await writeConfig('notes', dir); const config = await loadConfig(dir); assert.equal(config.storageDir, path.join(dir, 'notes')); });
