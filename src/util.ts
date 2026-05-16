import { createHash } from 'node:crypto';
import path from 'node:path';
export function slugify(input: string): string { return input.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'case'; }
export function sha256(text: string): string { return createHash('sha256').update(text).digest('hex'); }
export function shortHash(text: string): string { return sha256(text).slice(0, 12); }
export function toPosix(p: string): string { return p.split(path.sep).join('/'); }
export function escapeMarkdown(text: string): string { return text.replace(/`/g, '\\`'); }
export function formatTags(tags: string[]): string { return tags.length ? tags.map((tag) => `#${tag}`).join(' ') : '_none_'; }
