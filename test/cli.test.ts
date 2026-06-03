import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';

describe('clipcase CLI', () => {
  it('should list all case formats', () => {
    const out = execFileSync(process.execPath, ['dist/src/cli.js', 'list'], { encoding: 'utf8' });
    assert.ok(out.includes('camel') || out.includes('snake') || out.includes('kebab'),
      'list should show case formats');
  });

  it('should convert between case formats', () => {
    const out = execFileSync(process.execPath, ['dist/src/cli.js', 'convert', 'helloWorld', 'snake'], { encoding: 'utf8' });
    assert.ok(out.includes('hello_world'), 'should convert camelCase to snake_case');
  });

  it('should detect case format', () => {
    const out = execFileSync(process.execPath, ['dist/src/cli.js', 'detect', 'hello-world'], { encoding: 'utf8' });
    assert.ok(out.includes('kebab') || out.includes('dash') || out.includes('kebab-case'),
      'should detect kebab-case');
  });
});
