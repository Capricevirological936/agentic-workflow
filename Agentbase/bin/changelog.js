#!/usr/bin/env node
'use strict';

/**
 * Changelog Generator — Agentic Workflow
 *
 * Git commit tarihçesinden otomatik CHANGELOG.md üretir.
 * Conventional Commits formatını parse eder.
 *
 * Kullanım:
 *   node bin/changelog.js                    # Son tag'den bu yana
 *   node bin/changelog.js --all              # Tüm tarihçe
 *   node bin/changelog.js --from v0.1.0      # Belirli tag'den bu yana
 *   node bin/changelog.js --dry-run          # Dosyaya yazmadan göster
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');
const CHANGELOG_PATH = path.join(REPO_ROOT, 'CHANGELOG.md');

const CATEGORIES = {
  feat: { label: 'Eklenen', emoji: '' },
  fix: { label: 'Düzeltilen', emoji: '' },
  refactor: { label: 'Yeniden Düzenlenen', emoji: '' },
  docs: { label: 'Dokümantasyon', emoji: '' },
  test: { label: 'Test', emoji: '' },
  chore: { label: 'Bakım', emoji: '' },
  perf: { label: 'Performans', emoji: '' },
  style: { label: 'Stil', emoji: '' },
  ci: { label: 'CI/CD', emoji: '' },
};

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function getLatestTag() {
  return git('describe --tags --abbrev=0 2>/dev/null') || null;
}

function getCommits(from) {
  const range = from ? `${from}..HEAD` : '';
  const raw = git(`log ${range} --pretty=format:"%H|%s|%an|%ai" --no-merges`);
  if (!raw) return [];

  return raw.split('\n').filter(Boolean).map(line => {
    const [hash, subject, author, date] = line.split('|');
    const match = subject.match(/^(\w+)(?:\(([^)]*)\))?:\s*(.+)$/);
    if (!match) return { hash: hash.slice(0, 7), type: 'other', scope: null, message: subject, author, date };
    return {
      hash: hash.slice(0, 7),
      type: match[1],
      scope: match[2] || null,
      message: match[3].trim(),
      author,
      date,
    };
  });
}

function groupByType(commits) {
  const groups = {};
  for (const commit of commits) {
    const type = commit.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(commit);
  }
  return groups;
}

function formatDate(isoDate) {
  if (!isoDate) return new Date().toISOString().slice(0, 10);
  return isoDate.slice(0, 10);
}

function generateSection(version, date, commits) {
  const groups = groupByType(commits);
  const lines = [];

  lines.push(`## [${version}] - ${date}`);
  lines.push('');

  const typeOrder = ['feat', 'fix', 'refactor', 'perf', 'docs', 'test', 'chore', 'style', 'ci', 'other'];

  for (const type of typeOrder) {
    const group = groups[type];
    if (!group || group.length === 0) continue;

    const cat = CATEGORIES[type] || { label: 'Diğer' };
    lines.push(`### ${cat.label}`);
    lines.push('');

    for (const commit of group) {
      const scope = commit.scope ? `**${commit.scope}:** ` : '';
      lines.push(`- ${scope}${commit.message} (\`${commit.hash}\`)`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const all = args.includes('--all');
  const fromIdx = args.indexOf('--from');
  const fromTag = fromIdx !== -1 ? args[fromIdx + 1] : null;

  const latestTag = fromTag || (all ? null : getLatestTag());
  const commits = getCommits(latestTag);

  if (commits.length === 0) {
    console.log('Yeni commit bulunamadı.');
    return;
  }

  const version = latestTag ? `${latestTag} sonrası` : 'Yayınlanmamış';
  const date = formatDate(commits[0]?.date);
  const section = generateSection(version, date, commits);

  const header = '# Değişiklik Günlüğü\n\nTüm önemli değişiklikler bu dosyada belgelenir.\nFormat [Keep a Changelog](https://keepachangelog.com/tr/1.1.0/) standardını takip eder.\n\n';

  if (dryRun) {
    console.log(section);
    console.log(`\n--- ${commits.length} commit işlendi ---`);
    return;
  }

  let existing = '';
  if (fs.existsSync(CHANGELOG_PATH)) {
    existing = fs.readFileSync(CHANGELOG_PATH, 'utf8');
    // Header'ı atla, sadece içeriği al
    const headerEnd = existing.indexOf('\n## ');
    if (headerEnd !== -1) {
      existing = existing.slice(headerEnd);
    } else {
      existing = '';
    }
  }

  const content = header + section + '\n' + existing;
  fs.writeFileSync(CHANGELOG_PATH, content);
  console.log(`CHANGELOG.md güncellendi — ${commits.length} commit işlendi.`);
}

main();
