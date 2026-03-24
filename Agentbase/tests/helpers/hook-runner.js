'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  processSkeletonFile,
  resolveOutputPath,
} = require('../../generate.js');
const testManifest = require('./test-manifest.js');

const AGENTBASE_DIR = path.resolve(__dirname, '..', '..');
const TEMPLATES_DIR = path.join(AGENTBASE_DIR, 'templates');

function createTempProject(t) {
  // realpathSync: macOS'ta /var/folders → /private/var/folders symlink'ini cozer
  // Node.js __dirname gercek yolu kullanir, bu normalize olmadan startsWith basarisiz olur
  const rootDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'agentbase-hooks-')));
  fs.mkdirSync(path.join(rootDir, 'Agentbase', '.claude', 'hooks'), { recursive: true });
  fs.mkdirSync(path.join(rootDir, 'Codebase'), { recursive: true });

  if (t && typeof t.after === 'function') {
    t.after(() => {
      fs.rmSync(rootDir, { recursive: true, force: true });
    });
  }

  return rootDir;
}

function replaceConstArray(content, name, elements) {
  const arrayBody = elements.length > 0 ? `\n  ${elements.join(',\n  ')}\n` : '';
  return content.replace(
    new RegExp(`const ${name} = \\[[\\s\\S]*?\\];`),
    `const ${name} = [${arrayBody}];`
  );
}

function materializeHook(projectRoot, templateRelativePath, options = {}) {
  const templatePath = path.join(TEMPLATES_DIR, templateRelativePath);
  const agentbaseRoot = path.join(projectRoot, 'Agentbase');
  let content;

  if (templatePath.includes('.skeleton.')) {
    content = processSkeletonFile(templatePath, options.manifest || testManifest).outputContent;
  } else {
    content = fs.readFileSync(templatePath, 'utf8');
  }

  if (Array.isArray(options.arrayReplacements)) {
    for (const { name, elements } of options.arrayReplacements) {
      content = replaceConstArray(content, name, elements);
    }
  }

  if (Array.isArray(options.textReplacements)) {
    for (const replacement of options.textReplacements) {
      content = content.replace(replacement.find, replacement.replace);
    }
  }

  const hookPath = resolveOutputPath(templatePath, agentbaseRoot);
  fs.mkdirSync(path.dirname(hookPath), { recursive: true });
  fs.writeFileSync(hookPath, content, 'utf8');
  fs.chmodSync(hookPath, 0o755);

  // shared-hook-utils.js: tüm hook'lar bunu __dirname'den require eder.
  // Üretimde tüm hook'lar aynı .claude/hooks/ dizininde olur; test ortamında da aynısını sağla.
  const sharedUtils = path.join(TEMPLATES_DIR, 'core', 'hooks', 'shared-hook-utils.js');
  const sharedUtilsDest = path.join(path.dirname(hookPath), 'shared-hook-utils.js');
  if (!fs.existsSync(sharedUtilsDest)) {
    fs.copyFileSync(sharedUtils, sharedUtilsDest);
  }

  return hookPath;
}

function runHook(hookPath, input, options = {}) {
  const startedAt = process.hrtime.bigint();
  const result = spawnSync(process.execPath, [hookPath], {
    cwd: options.cwd || path.dirname(hookPath),
    encoding: 'utf8',
    env: {
      ...process.env,
      ...(options.env || {}),
    },
    input,
    timeout: options.timeout || 5000,
  });
  const endedAt = process.hrtime.bigint();

  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status,
    signal: result.signal,
    error: result.error,
    durationMs: Number(endedAt - startedAt) / 1e6,
  };
}

function writeCodebaseFile(projectRoot, relativePath, content = '') {
  const fullPath = path.join(projectRoot, 'Codebase', relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  return fullPath;
}

function makeHookInput(filePath) {
  return JSON.stringify({
    tool_input: {
      file_path: filePath,
    },
  });
}

function makeCommandInput(command) {
  return JSON.stringify({
    tool_input: {
      command,
    },
  });
}

module.exports = {
  createTempProject,
  makeCommandInput,
  makeHookInput,
  materializeHook,
  replaceConstArray,
  runHook,
  testManifest,
  writeCodebaseFile,
};
