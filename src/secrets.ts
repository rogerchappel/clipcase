import type { SecretFinding } from './types.js';
const SECRET_PATTERNS: Array<{ label: string; regex: RegExp; pattern: string }> = [
  { label: 'AWS access key', regex: /\bAKIA[0-9A-Z]{16}\b/g, pattern: 'AKIA[0-9A-Z]{16}' },
  { label: 'GitHub token', regex: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/g, pattern: 'gh[pousr]_[A-Za-z0-9_]{36,}' },
  { label: 'npm token', regex: /\bnpm_[A-Za-z0-9]{36,}\b/g, pattern: 'npm_[A-Za-z0-9]{36,}' },
  { label: 'Slack token', regex: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g, pattern: 'xox*- token' },
  { label: 'Private key', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g, pattern: 'BEGIN PRIVATE KEY' },
  { label: 'Generic assignment secret', regex: /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*['\"]?[^\s'\"]{12,}/gi, pattern: '(api_key|secret|token|password)=...' }
];
export function findSecrets(text: string): SecretFinding[] { const findings = new Map<string, SecretFinding>(); for (const rule of SECRET_PATTERNS) { rule.regex.lastIndex = 0; if (rule.regex.test(text)) findings.set(rule.label, { label: rule.label, pattern: rule.pattern }); } return [...findings.values()]; }
