const fs = require('fs');
const path = require('path');

function analyzePackageDependencies(packageJson) {
  const runtime = Object.entries(packageJson.dependencies || {}).map(([name, version]) => ({ name, version }));
  const dev = Object.entries(packageJson.devDependencies || {}).map(([name, version]) => ({ name, version }));

  return { runtime, dev };
}

function formatPackageSummary(packageJson) {
  const { runtime, dev } = analyzePackageDependencies(packageJson);
  const lines = [];

  lines.push(`Runtime dependencies (${runtime.length}):`);
  runtime.forEach((pkg) => lines.push(`- ${pkg.name}@${pkg.version}`));

  lines.push(`Development dependencies (${dev.length}):`);
  dev.forEach((pkg) => lines.push(`- ${pkg.name}@${pkg.version}`));

  return lines.join('\n');
}

function readPackageJson(projectRoot = process.cwd()) {
  const pkgPath = path.join(projectRoot, 'package.json');
  const raw = fs.readFileSync(pkgPath, 'utf8');
  return JSON.parse(raw);
}

function inspectCurrentProject(projectRoot = process.cwd()) {
  const packageJson = readPackageJson(projectRoot);
  const base = {
    name: packageJson.name || path.basename(projectRoot),
    summary: formatPackageSummary(packageJson),
    analysis: analyzePackageDependencies(packageJson),
    inventory: buildInventory(projectRoot, packageJson)
  };
  return base;
}

function findPackageUsage(projectRoot = process.cwd(), packageName) {
  if (!packageName) return { totalFiles: 0, totalMatches: 0, files: [] };

  const srcDir = path.join(projectRoot, 'src');
  const exts = new Set(['.js', '.jsx', '.ts', '.tsx']);
  const results = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && exts.has(path.extname(ent.name))) {
        const content = fs.readFileSync(full, 'utf8');
        const lines = content.split(/\r?\n/);
        const matches = [];
        const importRegex = new RegExp("from\\s+['\"]" + packageName + "['\"]");
        const requireRegex = new RegExp("require\\(\\s*['\"]" + packageName + "['\"]\\s*\\)");
        const pkgPathRegex = new RegExp("['\"]" + packageName + "(\\/[^'\"]*)?['\"]");

        lines.forEach((line, idx) => {
          if (importRegex.test(line) || requireRegex.test(line) || pkgPathRegex.test(line)) {
            matches.push({ line: idx + 1, text: line.trim() });
          }
        });

        if (matches.length) results.push({ file: path.relative(projectRoot, full), matches });
      }
    }
  }

  walk(srcDir);

  const totalFiles = results.length;
  const totalMatches = results.reduce((s, r) => s + r.matches.length, 0);

  return { totalFiles, totalMatches, files: results };
}

function inspectCurrentProjectWithPackage(projectRoot = process.cwd(), packageName) {
  const base = inspectCurrentProject(projectRoot);
  if (packageName) {
    const usage = findPackageUsage(projectRoot, packageName);
    base.usage = usage;
    // append usage summary to the human-readable summary
    base.summary += '\n\n' + `Usage for package '${packageName}': ${usage.totalMatches} matches in ${usage.totalFiles} files`;
  }
  return base;
}

function readJSONSync(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function isTreeShakable(projectRoot, packageName) {
  // try to read node_modules/<package>/package.json and inspect fields
  const pkgPath = path.join(projectRoot, 'node_modules', ...packageName.split('/'), 'package.json');
  const pkg = readJSONSync(pkgPath);
  if (!pkg) return false;
  if (typeof pkg.sideEffects !== 'undefined') return pkg.sideEffects === false;
  if (pkg.module || pkg['jsnext:main']) return true;
  return false;
}

function buildInventory(projectRoot, packageJson) {
  const deps = Object.assign({}, packageJson.dependencies || {}, packageJson.devDependencies || {});
  const suggestions = {
    lodash: ['ramda', 'underscore'],
    react: ['preact'],
    axios: ['fetch']
  };

  const inventory = [];
  for (const [name, version] of Object.entries(deps)) {
    const usage = findPackageUsage(projectRoot, name);
    const usedIn = usage.files.map(f => f.file).sort();
    const importCount = usage.totalMatches || 0;
    const dup = suggestions[name] || [];
    const tree = isTreeShakable(projectRoot, name);
    inventory.push({
      package: name,
      version,
      usedIn,
      importCount,
      duplicateAlternatives: dup,
      treeShakable: tree
    });
  }

  return inventory.sort((a, b) => a.package.localeCompare(b.package));
}

module.exports = {
  analyzePackageDependencies,
  formatPackageSummary,
  readPackageJson,
  inspectCurrentProject,
  inspectCurrentProjectWithPackage,
  findPackageUsage
};
