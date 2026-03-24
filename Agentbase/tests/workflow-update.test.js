'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  computeCodebaseHash,
  generateMeta,
  updateMeta,
  extractMeta,
  CONFIG_FILES,
} = require('../bin/manifest-meta.js');

const {
  diffModules,
  diffSubprojects,
  diffDependencies,
  computeDrift,
  DEPENDENCY_MODULE_MAP,
} = require('../bin/diff-engine.js');

// ─────────────────────────────────────────────────────
// MANIFEST META TESTLERI (TASK-176)
// ─────────────────────────────────────────────────────

describe('computeCodebaseHash', () => {
  it('config dosyalari olan dizin icin hash uretir', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-test-'));
    fs.writeFileSync(path.join(tmpDir, 'package.json'), '{"name":"test"}');
    fs.writeFileSync(path.join(tmpDir, 'tsconfig.json'), '{"strict":true}');

    const hash = computeCodebaseHash(tmpDir);
    assert.ok(hash, 'hash uretilmeli');
    assert.equal(hash.length, 12, 'hash 12 karakter olmali');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('ayni icerik ayni hash uretir (deterministik)', () => {
    const tmpDir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-a-'));
    const tmpDir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-b-'));
    fs.writeFileSync(path.join(tmpDir1, 'package.json'), '{"same":true}');
    fs.writeFileSync(path.join(tmpDir2, 'package.json'), '{"same":true}');

    assert.equal(computeCodebaseHash(tmpDir1), computeCodebaseHash(tmpDir2));
    fs.rmSync(tmpDir1, { recursive: true, force: true });
    fs.rmSync(tmpDir2, { recursive: true, force: true });
  });

  it('farkli icerik farkli hash uretir', () => {
    const tmpDir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-c-'));
    const tmpDir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-d-'));
    fs.writeFileSync(path.join(tmpDir1, 'package.json'), '{"version":"1.0.0"}');
    fs.writeFileSync(path.join(tmpDir2, 'package.json'), '{"version":"2.0.0"}');

    assert.notEqual(computeCodebaseHash(tmpDir1), computeCodebaseHash(tmpDir2));
    fs.rmSync(tmpDir1, { recursive: true, force: true });
    fs.rmSync(tmpDir2, { recursive: true, force: true });
  });

  it('bos dizin icin null doner', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-empty-'));
    assert.equal(computeCodebaseHash(tmpDir), null);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('null path icin null doner', () => {
    assert.equal(computeCodebaseHash(null), null);
    assert.equal(computeCodebaseHash('/nonexistent'), null);
  });
});

describe('generateMeta', () => {
  it('tum zorunlu alanlari uretiyor', () => {
    const meta = generateMeta('/tmp', '1.1.3');
    assert.equal(meta.version, 2);
    assert.ok(meta.created_at);
    assert.ok(meta.last_analyzed);
    assert.equal(meta.bootstrap_version, '1.1.3');
    assert.ok(Array.isArray(meta.update_history));
    assert.equal(meta.update_history[0].action, 'initial');
  });

  it('codebase_hash hesaplaniyor', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'meta-test-'));
    fs.writeFileSync(path.join(tmpDir, 'package.json'), '{}');
    const meta = generateMeta(tmpDir, '1.0.0');
    assert.notEqual(meta.codebase_hash, 'unknown');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

describe('updateMeta', () => {
  it('update_history ve changes guncelleniyor', () => {
    const old = generateMeta('/tmp', '1.0.0');
    const updated = updateMeta(old, '/tmp', ['+orm/prisma']);
    assert.ok(updated.last_analyzed, 'last_analyzed set edilmeli');
    assert.equal(updated.update_history.length, 2);
    assert.equal(updated.update_history[1].action, 'update');
    assert.deepEqual(updated.update_history[1].changes, ['+orm/prisma']);
  });
});

describe('extractMeta', () => {
  it('manifest ten meta cikarir', () => {
    const meta = extractMeta({ meta: { version: 2 }, project: {} });
    assert.equal(meta.version, 2);
  });

  it('meta yoksa null doner', () => {
    assert.equal(extractMeta({}), null);
    assert.equal(extractMeta(null), null);
  });
});

// ─────────────────────────────────────────────────────
// DIFF ENGINE TESTLERI (TASK-177)
// ─────────────────────────────────────────────────────

describe('diffModules', () => {
  it('eklenen ve kaldirilan modulleri tespit ediyor', () => {
    const result = diffModules(['prisma', 'express'], ['express', 'docker']);
    assert.deepEqual(result.added, ['docker']);
    assert.deepEqual(result.removed, ['prisma']);
    assert.deepEqual(result.unchanged, ['express']);
  });

  it('iki bos set icin bos sonuc', () => {
    const result = diffModules([], []);
    assert.deepEqual(result.added, []);
    assert.deepEqual(result.removed, []);
  });

  it('Set parametreleriyle de calisiyor', () => {
    const result = diffModules(new Set(['a']), new Set(['a', 'b']));
    assert.deepEqual(result.added, ['b']);
    assert.deepEqual(result.unchanged, ['a']);
  });
});

describe('diffSubprojects', () => {
  it('yeni subproject tespit ediyor', () => {
    const result = diffSubprojects(
      [{ name: 'api', path: 'src/api' }],
      [{ name: 'api', path: 'src/api' }, { name: 'mobile', path: 'apps/mobile' }],
    );
    assert.equal(result.added.length, 1);
    assert.equal(result.added[0].name, 'mobile');
  });

  it('degisen alan tespit ediyor', () => {
    const result = diffSubprojects(
      [{ name: 'api', test_command: 'jest' }],
      [{ name: 'api', test_command: 'vitest' }],
    );
    assert.equal(result.changed.length, 1);
    assert.equal(result.changed[0].changes[0].field, 'test_command');
    assert.equal(result.changed[0].changes[0].old, 'jest');
    assert.equal(result.changed[0].changes[0].new, 'vitest');
  });

  it('kaldirilan subproject tespit ediyor', () => {
    const result = diffSubprojects(
      [{ name: 'api' }, { name: 'web' }],
      [{ name: 'api' }],
    );
    assert.equal(result.removed.length, 1);
    assert.equal(result.removed[0].name, 'web');
  });

  it('null inputlar icin bos sonuc', () => {
    const result = diffSubprojects(null, null);
    assert.deepEqual(result, { added: [], removed: [], changed: [] });
  });
});

describe('diffDependencies', () => {
  it('yeni dependency icin modul oneriyor', () => {
    const result = diffDependencies(['express'], ['express', 'prisma']);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'prisma');
    assert.equal(result[0].action, 'added');
    assert.equal(result[0].suggested_module, 'orm/prisma');
  });

  it('kaldirilan dependency icin deaktivasyon oneriyor', () => {
    const result = diffDependencies(['prisma', 'express'], ['express']);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'prisma');
    assert.equal(result[0].action, 'removed');
  });

  it('eslesmesi olmayan dependency atlaniyor', () => {
    const result = diffDependencies([], ['lodash']);
    assert.equal(result.length, 0);
  });
});

describe('computeDrift', () => {
  it('degisiklik yoksa has_changes false', () => {
    const manifest = { modules: { active: { orm: 'prisma' } } };
    const result = computeDrift(manifest, manifest);
    assert.equal(result.has_changes, false);
  });

  it('yeni modul eklenmesini tespit ediyor', () => {
    const old = { modules: { active: { orm: 'prisma' } } };
    const now = { modules: { active: { orm: 'prisma', deploy: 'docker' } } };
    const result = computeDrift(old, now);
    assert.equal(result.has_changes, true);
    assert.ok(result.modules.added.includes('docker'));
  });

  it('standalone modul degisikligini tespit ediyor', () => {
    const old = { modules: { standalone: ['security'] } };
    const now = { modules: { standalone: ['security', 'monorepo'] } };
    const result = computeDrift(old, now);
    assert.ok(result.modules.added.includes('monorepo'));
  });

  it('karma degisiklikleri tam raporluyor', () => {
    const old = {
      modules: { active: { orm: 'prisma' } },
      subprojects: [{ name: 'api', test_command: 'jest' }],
      dependencies: ['prisma', 'express'],
    };
    const now = {
      modules: { active: { orm: 'prisma', deploy: 'docker' } },
      subprojects: [{ name: 'api', test_command: 'vitest' }],
      dependencies: ['prisma', 'express', 'react-native'],
    };
    const result = computeDrift(old, now);
    assert.equal(result.has_changes, true);
    assert.ok(result.modules.added.includes('docker'));
    assert.equal(result.subprojects.changed.length, 1);
    assert.equal(result.dependency_changes.length, 1);
    assert.equal(result.dependency_changes[0].suggested_module, 'mobile/react-native');
  });
});
