#!/usr/bin/env node
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { ClipcaseError } from './errors.js';
import { loadConfig, writeConfig } from './config.js';
import { addEntry, createCase, ensureStore, exportCase, listCases, loadCase, searchCases } from './storage.js';
function usage(): string { return `clipcase — local-first Markdown casefiles\n\nUsage:\n  clipcase init [--storage <path>]\n  clipcase new <case> [--title <title>]\n  clipcase add <case> [--source <label>] [--tag <tag>] [--clipboard] [--allow-secret]\n  clipcase list [--json]\n  clipcase show <case>\n  clipcase search <query> [--json]\n  clipcase export <case> [--out <file>]\n`; }
type Parsed = { command?: string; positionals: string[]; flags: Map<string, string[]> };
type CommandSpec = { min: number; max?: number; valueFlags?: string[]; booleanFlags?: string[] };
const commandSpecs: Record<string, CommandSpec> = {
  init: { min: 0, max: 0, valueFlags: ['storage'] },
  new: { min: 1, max: 1, valueFlags: ['title'] },
  add: { min: 1, max: 1, valueFlags: ['source', 'tag'], booleanFlags: ['clipboard', 'allow-secret'] },
  list: { min: 0, max: 0, booleanFlags: ['json'] },
  show: { min: 1, max: 1 },
  search: { min: 1, booleanFlags: ['json'] },
  export: { min: 1, max: 1, valueFlags: ['out'] },
};
function argumentError(message: string): never { throw new ClipcaseError(`${message}\n\n${usage()}`); }
function parse(argv: string[]): Parsed {
  const [command, ...rest] = argv;
  if (!command || command === 'help') return { command, positionals: rest, flags: new Map() };
  const spec = commandSpecs[command];
  if (!spec) argumentError(`Unknown command: ${command}`);
  const flags = new Map<string, string[]>();
  const positionals: string[] = [];
  const valueFlags = new Set(spec.valueFlags ?? []);
  const booleanFlags = new Set([...(spec.booleanFlags ?? []), 'help']);
  for (let i = 0; i < rest.length; i++) {
    const token = rest[i];
    if (!token.startsWith('--')) { positionals.push(token); continue; }
    const eq = token.indexOf('=');
    const key = token.slice(2, eq === -1 ? undefined : eq);
    if (!key || (!valueFlags.has(key) && !booleanFlags.has(key))) argumentError(`Unknown option for ${command}: --${key}`);
    let value: string;
    if (valueFlags.has(key)) {
      value = eq === -1 ? rest[++i] ?? '' : token.slice(eq + 1);
      if (!value || value.startsWith('--')) argumentError(`Option --${key} requires a value.`);
    } else {
      value = eq === -1 ? 'true' : token.slice(eq + 1);
      if (value !== 'true' && value !== 'false') argumentError(`Option --${key} requires true or false.`);
    }
    flags.set(key, [...(flags.get(key) ?? []), value]);
  }
  if (positionals.length < spec.min) argumentError(`Missing positional argument for ${command}.`);
  if (spec.max !== undefined && positionals.length > spec.max) argumentError(`Unexpected positional argument for ${command}: ${positionals[spec.max]}`);
  return { command, positionals, flags };
}
function flag(parsed: Parsed, name: string): string | undefined { return parsed.flags.get(name)?.at(-1); }
function flagAll(parsed: Parsed, name: string): string[] { return (parsed.flags.get(name) ?? []).flatMap((value) => value.split(',')).map((value) => value.trim()).filter(Boolean); }
function booleanFlag(parsed: Parsed, name: string): boolean { return flag(parsed, name) === 'true'; }
async function readStdin(): Promise<string> { if (process.stdin.isTTY) return ''; const chunks: Buffer[] = []; for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk)); return Buffer.concat(chunks).toString('utf8'); }
function readClipboard(): string { const cmd = process.platform === 'darwin' ? 'pbpaste' : process.platform === 'win32' ? 'powershell.exe' : 'xclip'; const args = process.platform === 'win32' ? ['-NoProfile', '-Command', 'Get-Clipboard'] : process.platform === 'linux' ? ['-selection', 'clipboard', '-o'] : []; const result = spawnSync(cmd, args, { encoding: 'utf8' }); if (result.status !== 0) throw new ClipcaseError('Clipboard read failed; pipe text on stdin instead.', 4); return result.stdout; }
export async function run(argv = process.argv.slice(2)): Promise<void> { const parsed = parse(argv); if (!parsed.command || booleanFlag(parsed, 'help') || parsed.command === 'help') { console.log(usage()); return; } if (parsed.command === 'init') { const target = await writeConfig(flag(parsed, 'storage') ?? '.clipcase'); const config = await loadConfig(); await ensureStore(config.storageDir); console.log(`Initialized ${target}`); return; } const config = await loadConfig(); await ensureStore(config.storageDir); switch (parsed.command) { case 'new': { const name = parsed.positionals[0]; const meta = await createCase(config.storageDir, name, flag(parsed, 'title')); console.log(`Created case ${meta.name}`); break; } case 'add': { const name = parsed.positionals[0]; const text = booleanFlag(parsed, 'clipboard') ? readClipboard() : await readStdin(); if (!text.trim()) throw new ClipcaseError('No input text supplied on stdin or clipboard.'); const entry = await addEntry(config.storageDir, { caseName: name, text, source: flag(parsed, 'source') ?? 'stdin', tags: flagAll(parsed, 'tag'), allowSecret: booleanFlag(parsed, 'allow-secret') }); console.log(`Added ${entry.id} to ${entry.caseName}`); break; } case 'list': { const cases = await listCases(config.storageDir); if (booleanFlag(parsed, 'json')) console.log(JSON.stringify(cases, null, 2)); else for (const meta of cases) console.log(`${meta.name}\t${meta.entries.length}\t${meta.updatedAt}\t${meta.title}`); break; } case 'show': { const name = parsed.positionals[0]; console.log(JSON.stringify(await loadCase(config.storageDir, name), null, 2)); break; } case 'search': { const query = parsed.positionals.join(' '); const results = await searchCases(config.storageDir, query); if (booleanFlag(parsed, 'json')) console.log(JSON.stringify(results, null, 2)); else for (const result of results) console.log(`${result.caseName}\t${result.entry.id}\t${result.entry.source}\t${result.preview}`); break; } case 'export': { const name = parsed.positionals[0]; const body = await exportCase(config.storageDir, name); const out = flag(parsed, 'out'); if (out) { await fs.writeFile(out, body); console.log(`Exported ${name} to ${out}`); } else process.stdout.write(body); break; } }
}
run().catch((error: unknown) => { if (error instanceof ClipcaseError) { console.error(error.message); process.exit(error.exitCode); } console.error(error); process.exit(1); });
