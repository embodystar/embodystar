import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

const directory = new URL(
  "../public/.well-known/agent-skills/",
  import.meta.url,
);
const indexUrl = "https://embodystar.com/.well-known/agent-skills/index.json";
const index = JSON.parse(
  readFileSync(new URL("index.json", directory), "utf8"),
);

test("skills discovery uses the v0.2.0 schema and lists every published skill once", () => {
  assert.equal(
    index.$schema,
    "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  );
  assert.ok(Array.isArray(index.skills) && index.skills.length > 0);
  const names = index.skills.map((skill) => skill.name);
  assert.equal(new Set(names).size, names.length);
  const published = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual([...names].sort(), published);
  for (const skill of index.skills) {
    assert.match(skill.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(skill.name.length <= 64);
    assert.equal(skill.type, "skill-md");
    assert.ok(
      typeof skill.description === "string" &&
        skill.description.trim().length > 0,
    );
    assert.ok(skill.description.length <= 1024);
    assert.match(skill.digest, /^sha256:[a-f0-9]{64}$/);
  }
});

test("skill URLs identify real artifacts whose exact bytes match their digests", () => {
  for (const skill of index.skills) {
    const url = new URL(skill.url, indexUrl);
    assert.equal(url.origin, "https://embodystar.com");
    assert.equal(
      url.pathname,
      `/.well-known/agent-skills/${skill.name}/SKILL.md`,
    );
    const bytes = readFileSync(new URL(`${skill.name}/SKILL.md`, directory));
    assert.equal(
      skill.digest,
      `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
    );
    const frontmatter = bytes.toString("utf8").split(/^---\r?$/m)[1];
    assert.ok(frontmatter);
    assert.ok(frontmatter.split(/\r?\n/).includes(`name: ${skill.name}`));
    const description = frontmatter
      .split(/\r?\n/)
      .find((line) => line.startsWith("description: "));
    assert.equal(
      JSON.parse(description.slice("description: ".length)),
      skill.description,
    );
  }
});
