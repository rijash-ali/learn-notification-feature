const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzePackageDependencies, formatPackageSummary } = require('./reactPackageAnalyzer');

test('reactPackageAnalyzer groups runtime and development dependencies', () => {
    const packageJson = {
      name: 'demo-app',
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0'
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@testing-library/react': '^16.0.0'
      }
    };

    const result = analyzePackageDependencies(packageJson);

    assert.deepEqual(result.runtime, [
      { name: 'react', version: '^19.0.0' },
      { name: 'react-dom', version: '^19.0.0' }
    ]);
    assert.deepEqual(result.dev, [
      { name: 'typescript', version: '^5.0.0' },
      { name: '@testing-library/react', version: '^16.0.0' }
    ]);
  });

  test('reactPackageAnalyzer formats a concise human-readable summary', () => {
    const packageJson = {
      name: 'demo-app',
      dependencies: {
        react: '^19.0.0',
        'react-redux': '^9.0.0'
      },
      devDependencies: {
        typescript: '^5.0.0'
      }
    };

    const summary = formatPackageSummary(packageJson);

    assert.match(summary, /Runtime dependencies \(2\):/);
    assert.match(summary, /react@\^19\.0\.0/);
    assert.match(summary, /Development dependencies \(1\):/);
    assert.match(summary, /typescript@\^5\.0\.0/);
  });
