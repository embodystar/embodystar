import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const modules = new Map();

// Exercise the actual TypeScript route handlers with Node's built-in test runner.
export function loadTypeScript(relativePath) {
  const filename = path.resolve(root, relativePath);
  if (modules.has(filename)) return modules.get(filename);

  const localRequire = createRequire(filename);
  const exports = {};
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const requireModule = (specifier) =>
    specifier.startsWith(".")
      ? loadTypeScript(path.resolve(path.dirname(filename), `${specifier}.ts`))
      : localRequire(specifier);

  new Function("require", "exports", code)(requireModule, exports);
  modules.set(filename, exports);
  return exports;
}
