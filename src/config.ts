import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import type { ClipcaseConfig } from './types.js';
export const CONFIG_FILE = '.clipcase.json';
export async function findConfig(start = process.cwd()): Promise<string | undefined> { let dir = path.resolve(start); while (true) { const candidate = path.join(dir, CONFIG_FILE); try { await fs.access(candidate); return candidate; } catch {} const parent = path.dirname(dir); if (parent === dir) return undefined; dir = parent; } }
function expandHome(p: string): string { return p === '~' ? os.homedir() : p.startsWith('~/') ? path.join(os.homedir(), p.slice(2)) : p; }
export async function loadConfig(cwd = process.cwd()): Promise<ClipcaseConfig> { const explicit = process.env.CLIPCASE_HOME; if (explicit) return { storageDir: path.resolve(expandHome(explicit)) }; const configPath = await findConfig(cwd); if (!configPath) return { storageDir: path.join(cwd, '.clipcase') }; const raw = JSON.parse(await fs.readFile(configPath, 'utf8')) as Partial<ClipcaseConfig>; const base = path.dirname(configPath); const configured = expandHome(raw.storageDir ?? '.clipcase'); return { storageDir: path.isAbsolute(configured) ? configured : path.resolve(base, configured) }; }
export async function writeConfig(storageDir = '.clipcase', cwd = process.cwd()): Promise<string> { const target = path.join(cwd, CONFIG_FILE); await fs.writeFile(target, JSON.stringify({ storageDir }, null, 2) + '\n', { flag: 'wx' }); return target; }
