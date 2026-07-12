#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const tempDir = await mkdtemp(join(tmpdir(), "clipcase-pack-smoke-"));

try {
  const output = execFileSync(
    "npm",
    ["pack", "--pack-destination", tempDir, "--json"],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"]
    }
  );

  const [pack] = JSON.parse(output);
  const publishedFiles = new Set(pack.files.map((file) => file.path));
  const expectedFiles = [
    "dist/src/cli.js",
    "dist/src/index.js",
    "README.md",
    "LICENSE",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "scripts/smoke.sh"
  ];
  const missing = expectedFiles.filter((file) => !publishedFiles.has(file));

  if (missing.length > 0) {
    console.error("clipcase package smoke failed; missing expected file(s):");
    for (const file of missing) {
      console.error(`- ${file}`);
    }
    process.exit(1);
  }

  const installDir = join(tempDir, "install");
  execFileSync("npm", ["install", "--prefix", installDir, join(tempDir, pack.filename)], {
    stdio: ["ignore", "ignore", "inherit"]
  });

  const binPath = join(installDir, "node_modules", ".bin", "clipcase");
  const help = execFileSync(binPath, { encoding: "utf8" });
  if (!help.includes("clipcase init")) {
    throw new Error("installed CLI help did not include expected init usage");
  }

  console.log(
    `clipcase package smoke passed with ${pack.files.length} packed file(s) and installed CLI help.`
  );
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
