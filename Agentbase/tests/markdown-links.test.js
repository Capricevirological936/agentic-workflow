'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

// Taranan dizinler — node_modules, backlog, .git haric
const SCAN_DIRS = [
  REPO_ROOT,                                       // root README, CONTRIBUTING, vs.
  path.join(REPO_ROOT, 'Agentbase', 'templates'),  // tum template .md dosyalari
  path.join(REPO_ROOT, 'Agentbase'),               // PROJECT.md, STACK.md, vs.
  path.join(REPO_ROOT, 'Docbase'),                  // proje dokumanlari
];

const SKIP_DIRS = ['node_modules', '.git', 'backlog', '.claude'];

// Placeholder link hedefleri
const PLACEHOLDER_RE = /^(TODO|TBD|FIXME|PLACEHOLDER|javascript:|data:)/i;

// Markdown link regex: [text](target) veya ![alt](target)
// Kod bloklari icindeki linkleri atlar (basit yaklasim: satir ` veya ``` ile baslamiyorsa)
const LINK_RE = /!?\[[^\]]*\]\(([^)]+)\)/g;

function collectMarkdownFiles(dir, collected = new Set()) {
  if (!fs.existsSync(dir)) return collected;

  // root dizin icin sadece .md dosyalarini tara (alt dizinlere recursive gitme — SCAN_DIRS bunu yapar)
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry.name)) continue;
    if (entry.isSymbolicLink()) continue; // symlink traversal korunmasi

    const fullPath = path.join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith('.md')) {
      collected.add(fullPath);
    } else if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath, collected);
    }
  }
  return collected;
}

function extractLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const links = [];
  const lines = content.split('\n');
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Kod blogu baslangiclari/bitisleri — linkleri atla
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    let match;
    LINK_RE.lastIndex = 0;
    while ((match = LINK_RE.exec(line)) !== null) {
      links.push({
        target: match[1].trim(),
        line: i + 1,
        file: filePath,
      });
    }
  }
  return links;
}

function isExternalOrAnchor(target) {
  return (
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('mailto:') ||
    target.startsWith('#')        // in-page anchor
  );
}

function validateLink(link) {
  const { target, line, file } = link;

  // Harici URL ve in-page anchor atla
  if (isExternalOrAnchor(target)) return null;

  // Placeholder kontrolu
  if (PLACEHOLDER_RE.test(target)) {
    return { file, line, target, reason: 'placeholder link' };
  }

  // Anchor'u cikar: path#anchor → path
  const pathPart = target.split('#')[0];
  if (!pathPart) return null; // sadece #anchor

  // Goreceli yolu coz
  const baseDir = path.dirname(file);
  const resolved = path.resolve(baseDir, pathPart);

  if (!fs.existsSync(resolved)) {
    return { file, line, target, reason: 'hedef bulunamadi' };
  }

  return null;
}

describe('Markdown link dogrulama', () => {
  const allFiles = new Set();
  for (const dir of SCAN_DIRS) {
    collectMarkdownFiles(dir, allFiles);
  }
  const files = [...allFiles].sort();

  it('repo icinde markdown dosyalari bulunmali', () => {
    assert.ok(files.length > 0, `Hic markdown dosyasi bulunamadi`);
  });

  it('tum goreceli linkler gecerli hedeflere isaret etmeli', () => {
    const broken = [];

    for (const file of files) {
      const links = extractLinks(file);
      for (const link of links) {
        const error = validateLink(link);
        if (error) broken.push(error);
      }
    }

    if (broken.length > 0) {
      const report = broken
        .map(b => {
          const rel = path.relative(REPO_ROOT, b.file);
          return `  ${rel}:${b.line} → ${b.target} (${b.reason})`;
        })
        .join('\n');
      assert.fail(`${broken.length} kirik/placeholder link:\n${report}`);
    }
  });

  it('placeholder link tespit edebilmeli', () => {
    assert.ok(PLACEHOLDER_RE.test('TODO'), 'TODO tespit edilmeli');
    assert.ok(PLACEHOLDER_RE.test('javascript:void(0)'), 'javascript: tespit edilmeli');
    assert.ok(!PLACEHOLDER_RE.test('README.md'), 'README.md placeholder degil');
  });
});
