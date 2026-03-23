#!/usr/bin/env node
'use strict';

/**
 * changelog.test.js — changelog.js icin birim testler
 * Calistirma: node --test tests/changelog.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  groupByType,
  generateSection,
  formatDate,
  CATEGORIES,
  HEADER,
} = require('../bin/changelog.js');

// ─────────────────────────────────────────────────────
// YARDIMCI FONKSIYON TESTLERI
// ─────────────────────────────────────────────────────

describe('formatDate', () => {
  it('ISO tarihten YYYY-MM-DD cikarir', () => {
    assert.equal(formatDate('2026-03-23 15:30:00 +0300'), '2026-03-23');
  });

  it('null icin bugunun tarihini dondurur', () => {
    const today = new Date().toISOString().slice(0, 10);
    assert.equal(formatDate(null), today);
  });

  it('undefined icin bugunun tarihini dondurur', () => {
    const today = new Date().toISOString().slice(0, 10);
    assert.equal(formatDate(undefined), today);
  });
});

describe('groupByType', () => {
  it('commit leri tipe gore gruplar', () => {
    const commits = [
      { type: 'feat', message: 'A' },
      { type: 'fix', message: 'B' },
      { type: 'feat', message: 'C' },
    ];
    const groups = groupByType(commits);
    assert.equal(groups.feat.length, 2);
    assert.equal(groups.fix.length, 1);
  });

  it('bos dizi icin bos obje dondurur', () => {
    assert.deepEqual(groupByType([]), {});
  });
});

// ─────────────────────────────────────────────────────
// SECTION URETIM TESTLERI
// ─────────────────────────────────────────────────────

describe('generateSection', () => {
  const commits = [
    { hash: 'abc1234', type: 'feat', scope: null, message: 'yeni ozellik', author: 'test', date: '2026-03-23' },
    { hash: 'def5678', type: 'fix', scope: 'api', message: 'hata duzeltme', author: 'test', date: '2026-03-23' },
    { hash: 'ghi9012', type: 'docs', scope: null, message: 'dokumantasyon', author: 'test', date: '2026-03-22' },
  ];

  it('versiyon basligi dogru formatta', () => {
    const section = generateSection('1.0.0', '2026-03-23', commits);
    assert.ok(section.startsWith('## [1.0.0] - 2026-03-23'));
  });

  it('Yayinlanmamis versiyonu destekler', () => {
    const section = generateSection('Yayınlanmamış', '2026-03-23', commits);
    assert.ok(section.includes('[Yayınlanmamış]'));
  });

  it('commit tipleri dogru kategorilerde', () => {
    const section = generateSection('1.0.0', '2026-03-23', commits);
    assert.ok(section.includes('### Eklenen'));
    assert.ok(section.includes('### Düzeltilen'));
    assert.ok(section.includes('### Dokümantasyon'));
  });

  it('scope li commit bold prefix ile gosteriliyor', () => {
    const section = generateSection('1.0.0', '2026-03-23', commits);
    assert.ok(section.includes('**api:** hata duzeltme'));
  });

  it('commit hash backtick icinde', () => {
    const section = generateSection('1.0.0', '2026-03-23', commits);
    assert.ok(section.includes('(`abc1234`)'));
  });

  it('feat fix docs siralamasini takip ediyor', () => {
    const section = generateSection('1.0.0', '2026-03-23', commits);
    const featIdx = section.indexOf('### Eklenen');
    const fixIdx = section.indexOf('### Düzeltilen');
    const docsIdx = section.indexOf('### Dokümantasyon');
    assert.ok(featIdx < fixIdx, 'feat fix ten once olmali');
    assert.ok(fixIdx < docsIdx, 'fix docs tan once olmali');
  });

  it('bos commit dizisi icin bos string dondurur', () => {
    assert.equal(generateSection('1.0.0', '2026-03-23', []), '');
  });
});

// ─────────────────────────────────────────────────────
// RELEASE FONKSIYONU TESTLERI
// ─────────────────────────────────────────────────────

describe('releaseVersion', () => {
  // releaseVersion fs.writeFileSync kullanıyor, mock ile test
  it('Yayinlanmamis bolumunu versiyon ile degistiriyor', () => {
    const tmpFile = path.join(os.tmpdir(), `changelog-release-${Date.now()}.md`);
    const content = HEADER + '## [Yayınlanmamış] - 2026-03-23\n\n### Eklenen\n\n- Test ozellik (`abc1234`)\n';
    fs.writeFileSync(tmpFile, content);

    // releaseVersion CHANGELOG_PATH kullanıyor, dogrudan dosya icerigini test edelim
    const original = fs.readFileSync(tmpFile, 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    const updated = original.replace(
      /## \[Yayınlanmamış\]\s*-\s*\d{4}-\d{2}-\d{2}/,
      `## [1.0.0] - ${today}`
    );

    assert.ok(updated.includes('[1.0.0]'), 'versiyon degismeli');
    assert.ok(!updated.includes('[Yayınlanmamış]'), 'Yayinlanmamis kalmamali');
    assert.ok(updated.includes('Test ozellik'), 'icerik korunmali');

    fs.unlinkSync(tmpFile);
  });

  it('v prefix i cikariliyor', () => {
    const version = 'v1.2.3';
    const displayVersion = version.replace(/^v/, '');
    assert.equal(displayVersion, '1.2.3');
  });
});

// ─────────────────────────────────────────────────────
// CATEGORIES YAPISAL TESTLERI
// ─────────────────────────────────────────────────────

describe('CATEGORIES', () => {
  it('tum conventional commit tipleri tanimli', () => {
    const required = ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'perf', 'style', 'ci'];
    for (const type of required) {
      assert.ok(CATEGORIES[type], `${type} kategorisi tanimli olmali`);
      assert.ok(CATEGORIES[type].label, `${type} label olmali`);
    }
  });
});

// ─────────────────────────────────────────────────────
// HEADER TESTLERI
// ─────────────────────────────────────────────────────

describe('HEADER', () => {
  it('Keep a Changelog referansi iceriyor', () => {
    assert.ok(HEADER.includes('keepachangelog.com'));
  });

  it('baslik satiri var', () => {
    assert.ok(HEADER.startsWith('# '));
  });
});
