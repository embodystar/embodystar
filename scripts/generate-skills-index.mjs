import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const directory = new URL(
  "../public/.well-known/agent-skills/",
  import.meta.url,
);
const indexPath = new URL("index.json", directory);
const checkOnly = process.argv.slice(2).includes("--check");
if (process.argv.slice(2).some((arg) => arg !== "--check")) {
  throw new Error("Usage: node scripts/generate-skills-index.mjs [--check]");
}

const names = readdirSync(directory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const skills = names.map((directoryName) => {
  const artifact = new URL(`${directoryName}/SKILL.md`, directory);
  const bytes = readFileSync(artifact);
  const frontmatter = bytes
    .toString("utf8")
    .match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!frontmatter)
    throw new Error(`Missing frontmatter: ${fileURLToPath(artifact)}`);

  const name = frontmatter.match(/^name: ([a-z0-9]+(?:-[a-z0-9]+)*)\r?$/m)?.[1];
  if (!name || name.length > 64 || name !== directoryName) {
    throw new Error(`Invalid or mismatched skill name: ${directoryName}`);
  }
  // A single JSON-quoted description is valid YAML and needs no YAML dependency.
  const descriptionLine = frontmatter.match(
    /^description: ("[^\r\n]*")\r?$/m,
  )?.[1];
  if (!descriptionLine)
    throw new Error(`Use a single JSON-quoted description in ${name}/SKILL.md`);
  const description = JSON.parse(descriptionLine);
  if (
    typeof description !== "string" ||
    !description.trim() ||
    description.length > 1024
  ) {
    throw new Error(`Invalid skill description: ${name}`);
  }

  return {
    name,
    type: "skill-md",
    description,
    url: `https://embodystar.com/.well-known/agent-skills/${name}/SKILL.md`,
    digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
  };
});

const index = {
  $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  skills,
};
const serialized = `${JSON.stringify(index, null, 2)}\n`;
if (checkOnly) {
  if (readFileSync(indexPath, "utf8") !== serialized) {
    throw new Error(
      "Skills index is stale. Run pnpm skills:generate and commit the updated index.",
    );
  }
  console.log(`Skills index verified (${skills.length} skill).`);
} else {
  writeFileSync(indexPath, serialized);
  console.log(`Skills index generated (${skills.length} skill).`);
}
