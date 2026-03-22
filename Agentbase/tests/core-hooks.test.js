'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const {
  createTempProject,
  makeHookInput,
  materializeHook,
  runHook,
  writeCodebaseFile,
} = require('./helpers/hook-runner.js');
const { loadModuleExports } = require('./helpers/module-loader.js');

describe('code-review-check hook', () => {
  it('reports critical findings and preserves the original payload on stdout', t => {
    const projectRoot = createTempProject(t);
    const hookPath = materializeHook(projectRoot, 'core/hooks/code-review-check.skeleton.js');
    const filePath = writeCodebaseFile(
      projectRoot,
      'apps/api/src/leak.js',
      'const apiKey = "sk-secretvalue";\n'
    );
    const input = makeHookInput(filePath);

    const result = runHook(hookPath, input);

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), input);
    assert.match(result.stderr, /CRITICAL/);
    assert.match(result.stderr, /Hardcoded API key/);
  });

  it('skips files outside the configured extension list', t => {
    const projectRoot = createTempProject(t);
    const hookPath = materializeHook(projectRoot, 'core/hooks/code-review-check.skeleton.js');
    const filePath = writeCodebaseFile(
      projectRoot,
      'apps/api/src/leak.txt',
      'const apiKey = "sk-secretvalue";\n'
    );

    const result = runHook(hookPath, makeHookInput(filePath));

    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
  });

  it('handles long suspicious input without regex slowdowns', t => {
    const projectRoot = createTempProject(t);
    const hookPath = materializeHook(projectRoot, 'core/hooks/code-review-check.skeleton.js');
    const longLine = `"${'a'.repeat(20000)}"`;
    const filePath = writeCodebaseFile(projectRoot, 'apps/api/src/large.js', `${longLine}\n`);

    const result = runHook(hookPath, makeHookInput(filePath), { timeout: 1000 });

    assert.equal(result.status, 0);
    assert.ok(result.durationMs < 100);
  });
});

describe('test-reminder hook', () => {
  it('detectLayer matches configured subproject patterns', () => {
    const hookPath = path.join(
      __dirname,
      '..',
      'templates',
      'core',
      'hooks',
      'test-reminder.skeleton.js'
    );
    const { detectLayer } = loadModuleExports(hookPath, {
      exports: ['detectLayer'],
      replacements: [
        {
          find: /const LAYER_TESTS = \[[\s\S]*?\];/,
          replace:
            "const LAYER_TESTS = [{ pattern: /apps\\/api\\/src\\//, layer: 'API', command: 'npm test', extra: null }];",
        },
      ],
    });

    const layerInfo = detectLayer('/tmp/example/Codebase/apps/api/src/user.service.ts');
    assert.equal(layerInfo.layer, 'API');
  });

  it('emits a reminder only once per layer via state tracking', t => {
    const projectRoot = createTempProject(t);
    const hookPath = materializeHook(projectRoot, 'core/hooks/test-reminder.skeleton.js');
    const filePath = writeCodebaseFile(projectRoot, 'apps/api/src/service.ts', 'export const ok = true;\n');
    const input = makeHookInput(filePath);

    const firstRun = runHook(hookPath, input);
    const secondRun = runHook(hookPath, input);

    assert.match(firstRun.stderr, /Test Hatirlatma/);
    assert.match(firstRun.stderr, /api/);
    assert.equal(secondRun.stderr, '');
  });
});

describe('auto-format hook', () => {
  it('fixSmartQuotes normalizes copied punctuation', () => {
    const hookPath = path.join(
      __dirname,
      '..',
      'templates',
      'modules',
      'monorepo',
      'hooks',
      'auto-format.skeleton.js'
    );
    const { fixSmartQuotes } = loadModuleExports(hookPath, {
      exports: ['fixSmartQuotes'],
    });

    const fixed = fixSmartQuotes('“Merhaba” — test…');
    assert.equal(fixed, '"Merhaba" -- test...');
  });

  it('detectSubproject and findFormatterConfig honor subproject-specific configs', t => {
    const projectRoot = createTempProject(t);
    const codebaseRoot = path.join(projectRoot, 'Codebase');
    fs.mkdirSync(path.join(codebaseRoot, 'apps', 'api'), { recursive: true });
    fs.writeFileSync(path.join(codebaseRoot, 'apps', 'api', '.prettierrc'), '{ "semi": false }\n', 'utf8');

    const hookPath = path.join(
      __dirname,
      '..',
      'templates',
      'modules',
      'monorepo',
      'hooks',
      'auto-format.skeleton.js'
    );
    const { detectSubproject, findFormatterConfig } = loadModuleExports(hookPath, {
      exports: ['detectSubproject', 'findFormatterConfig'],
      replacements: [
        {
          find: /const CODEBASE_ROOT = .*;/,
          replace: `const CODEBASE_ROOT = ${JSON.stringify(codebaseRoot)};`,
        },
        {
          find: /const SUBPROJECT_CONFIGS = \[[\s\S]*?\];/,
          replace:
            "const SUBPROJECT_CONFIGS = [{ name: 'api', path: 'apps/api', configFile: '.prettierrc', formatter: 'prettier' }];",
        },
      ],
    });

    const filePath = path.join(codebaseRoot, 'apps', 'api', 'src', 'screen.ts');
    const subproject = detectSubproject(filePath);

    assert.equal(subproject.name, 'api');
    assert.equal(
      findFormatterConfig(subproject),
      path.join(codebaseRoot, 'apps', 'api', '.prettierrc')
    );
  });

  it('passes formatter config to prettier when a config file exists', t => {
    const projectRoot = createTempProject(t);
    const codebaseRoot = path.join(projectRoot, 'Codebase');
    const codeFile = writeCodebaseFile(projectRoot, 'apps/api/src/view.ts', 'const title = "Merhaba";\n');
    const configPath = writeCodebaseFile(projectRoot, 'apps/api/.prettierrc', '{ "semi": false }\n');
    const capturedExec = [];
    const hookPath = path.join(
      __dirname,
      '..',
      'templates',
      'modules',
      'monorepo',
      'hooks',
      'auto-format.skeleton.js'
    );
    const { runFormatter } = loadModuleExports(hookPath, {
      exports: ['runFormatter'],
      context: {
        __capturedExec: capturedExec,
      },
      replacements: [
        {
          find: /const CODEBASE_ROOT = .*;/,
          replace: `const CODEBASE_ROOT = ${JSON.stringify(codebaseRoot)};`,
        },
        {
          find: /const \{ execSync \} = require\('child_process'\);/,
          replace: 'const execSync = (...args) => { globalThis.__capturedExec.push(args); };',
        },
      ],
    });

    runFormatter(codeFile, {
      name: 'api',
      path: 'apps/api',
      configFile: '.prettierrc',
      formatter: 'prettier',
    });

    assert.equal(capturedExec.length, 1);
    assert.match(capturedExec[0][0], /--config/);
    assert.match(capturedExec[0][0], new RegExp(configPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});

describe('openapi-sync-check hook', () => {
  it('warns when a route file is newer than the spec', t => {
    const projectRoot = createTempProject(t);
    const hookPath = materializeHook(projectRoot, 'modules/api-docs/openapi/hooks/openapi-sync-check.skeleton.js', {
      arrayReplacements: [
        {
          name: 'ROUTE_PATTERNS',
          elements: ['/controllers\\//', '/\\.controller\\.(ts|js)$/'],
        },
        {
          name: 'SPEC_PATHS',
          elements: ["'docs/openapi.yaml'"],
        },
      ],
    });

    const routeFile = writeCodebaseFile(projectRoot, 'apps/api/src/controllers/user.controller.ts', 'export {};\n');
    const specFile = writeCodebaseFile(projectRoot, 'docs/openapi.yaml', 'openapi: 3.0.0\n');
    const olderTime = new Date('2026-03-20T10:00:00Z');
    const newerTime = new Date('2026-03-20T11:00:00Z');
    fs.utimesSync(specFile, olderTime, olderTime);
    fs.utimesSync(routeFile, newerTime, newerTime);

    const input = makeHookInput(routeFile);
    const result = runHook(hookPath, input);

    assert.equal(result.stdout, input);
    assert.match(result.stderr, /OpenAPI Spec Hatirlatmasi/);
    assert.match(result.stderr, /docs\/openapi\.yaml/);
  });

  it('stays silent when the spec is newer than the route file', t => {
    const projectRoot = createTempProject(t);
    const hookPath = materializeHook(projectRoot, 'modules/api-docs/openapi/hooks/openapi-sync-check.skeleton.js', {
      arrayReplacements: [
        {
          name: 'ROUTE_PATTERNS',
          elements: ['/controllers\\//'],
        },
        {
          name: 'SPEC_PATHS',
          elements: ["'docs/openapi.yaml'"],
        },
      ],
    });

    const routeFile = writeCodebaseFile(projectRoot, 'apps/api/src/controllers/user.controller.ts', 'export {};\n');
    const specFile = writeCodebaseFile(projectRoot, 'docs/openapi.yaml', 'openapi: 3.0.0\n');
    const olderTime = new Date('2026-03-20T10:00:00Z');
    const newerTime = new Date('2026-03-20T11:00:00Z');
    fs.utimesSync(routeFile, olderTime, olderTime);
    fs.utimesSync(specFile, newerTime, newerTime);

    const result = runHook(hookPath, makeHookInput(routeFile));

    assert.equal(result.stderr, '');
  });
});
