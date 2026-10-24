import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
);
const validationEntrypoint = await readFile(
  new URL("../scripts/validate.sh", import.meta.url),
  "utf8"
);

test("release:check runs every required validation step before optional agent-qc", () => {
  const commands = packageJson.scripts["release:check"].split("&&").map((part) => part.trim());
  const required = [
    "npm test",
    "npm run check",
    "npm run build",
    "npm run smoke",
    "npm run package:smoke",
    "npm run release:contract",
    "bash scripts/validate.sh",
  ];

  assert.deepEqual(commands, required);
  assert.match(validationEntrypoint, /agent-qc ready/);
  assert.doesNotMatch(validationEntrypoint, /npm\s+(?:test|run\s+(?:check|build|smoke|package:smoke|release:contract))/);
});
