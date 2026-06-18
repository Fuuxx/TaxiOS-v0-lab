import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "../../..");
const outputDir = path.resolve(__dirname, "../public/r");

const registryPath = path.resolve(workspaceRoot, "registry.json");
const registryRaw = await readFile(registryPath, "utf8");
const registry = JSON.parse(registryRaw);

const registryItems = registry.items;

// Build a map of every file path -> its target (for import rewriting)
const targetByPath = new Map();
for (const item of registryItems) {
  for (const file of item.files ?? []) {
    targetByPath.set(file.path, file.target ?? file.path);
  }
}

// Also map @taxios-v2/ui/X imports to target paths
function resolveImportToTarget(importPath) {
  // Strip @taxios-v2/ui/ prefix
  const cleanPath = importPath.replace(/^@taxios-v2\/ui\//, "");
  const candidates = [
    `packages/ui/src/${cleanPath}`,
    `packages/ui/src/${cleanPath}.tsx`,
    `packages/ui/src/${cleanPath}.ts`,
    `packages/ui/src/${cleanPath}.css`,
  ];
  for (const candidate of candidates) {
    const target = targetByPath.get(candidate);
    if (target) return target;
  }
  return null;
}

function rewriteImports(content, currentTarget) {
  // Rewrite import/export ... from "@taxios-v2/ui/..."
  let result = content.replace(
    /((?:import|export)\b(?:[^"']*))\bfrom\b\s*["'](@taxios-v2\/ui\/[^"']+)["']/g,
    (match, prefix, importPath) => {
      const target = resolveImportToTarget(importPath);
      if (!target) {
        console.warn(`  ⚠️  Unresolved import: ${importPath} in ${currentTarget}`);
        return match;
      }
      const aliasPath = target.replace(/\.(tsx|ts)$/, "");
      return `${prefix}from "@/${aliasPath}"`;
    }
  );
  // Rewrite side-effect imports: import "@taxios-v2/ui/..."
  result = result.replace(
    /import\s*["'](@taxios-v2\/ui\/[^"']+)["']/g,
    (match, importPath) => {
      const target = resolveImportToTarget(importPath);
      if (!target) {
        console.warn(`  ⚠️  Unresolved import: ${importPath} in ${currentTarget}`);
        return match;
      }
      const aliasPath = target.replace(/\.(tsx|ts)$/, "");
      return `import "@/${aliasPath}"`;
    }
  );
  return result;
}

function resolveLocalRegistryItems(item, seen = new Set()) {
  if (seen.has(item.name)) return [];
  seen.add(item.name);
  const localDependencies = (item.registryDependencies ?? [])
    .map((depName) => registryItems.find((c) => c.name === depName))
    .filter(Boolean);
  return [
    ...localDependencies.flatMap((dep) => resolveLocalRegistryItems(dep, seen)),
    item,
  ];
}

function uniqueValues(values) {
  return Array.from(new Set(values));
}

function uniqueFiles(files) {
  const byTargetOrPath = new Map();
  for (const file of files) {
    byTargetOrPath.set(file.target ?? file.path, file);
  }
  return Array.from(byTargetOrPath.values());
}

function orderFiles(ownFiles, depFiles) {
  const seen = new Set();
  const result = [];
  for (const file of ownFiles) {
    const key = file.target ?? file.path;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(file);
    }
  }
  for (const file of depFiles) {
    const key = file.target ?? file.path;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(file);
    }
  }
  return result;
}

async function withFileContent(file) {
  const filePath = path.resolve(workspaceRoot, file.path);
  const rawContent = await readFile(filePath, "utf8");
  const target = file.target ?? file.path;
  const content = rewriteImports(rawContent, target);
  return { ...file, content };
}

await mkdir(outputDir, { recursive: true });

await writeFile(
  path.resolve(outputDir, "registry.json"),
  JSON.stringify(registry, null, 2)
);

for (const item of registryItems) {
  const resolvedItems = resolveLocalRegistryItems(item);
  const depItems = resolvedItems.filter((r) => r.name !== item.name);
  const ownItems = resolvedItems.filter((r) => r.name === item.name);
  const depFiles = depItems.flatMap((r) => (r.files ?? []).filter((f) => !f.path.includes("/entries/")));
  const ownFiles = ownItems.flatMap((r) => r.files ?? []);
  const files = await Promise.all(
    orderFiles(ownFiles, depFiles).map(withFileContent)
  );
  const dependencies = uniqueValues(
    resolvedItems.flatMap((r) => r.dependencies ?? [])
  );

  const { registryDependencies: _, ...itemWithoutLocalDeps } = item;
  const output = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...itemWithoutLocalDeps,
    dependencies,
    files,
  };

  await writeFile(
    path.resolve(outputDir, `${item.name}.json`),
    JSON.stringify(output, null, 2)
  );
}

console.log(`Generated ${registryItems.length + 1} registry JSON files in public/r/`);
