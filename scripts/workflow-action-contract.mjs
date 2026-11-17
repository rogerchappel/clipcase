import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const readWorkflow = (name) => readFileSync(new URL(`../.github/workflows/${name}.yml`, import.meta.url), 'utf8');
const actions = (workflow) => Object.fromEntries(
  [...workflow.matchAll(/^\s*- uses: actions\/(checkout|setup-node)@(v\d+)\s*$/gm)]
    .map(([, action, version]) => [action, version]),
);

const ci = actions(readWorkflow('ci'));
assert.deepEqual(Object.keys(ci).sort(), ['checkout', 'setup-node'], 'CI must declare checkout and setup-node actions');
for (const workflowName of ['release', 'release-dry-run']) {
  const workflow = actions(readWorkflow(workflowName));
  for (const action of ['checkout', 'setup-node']) {
    assert.equal(
      workflow[action],
      ci[action],
      `${workflowName} must use actions/${action}@${ci[action]} to match CI (found ${workflow[action] ?? 'missing'})`,
    );
  }
}
console.log('Release workflow actions match CI.');
