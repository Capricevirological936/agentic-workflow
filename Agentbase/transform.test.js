#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { extractDescription, adaptInvokeSyntax, adaptPathReferences } = require('./transform.js');

describe('extractDescription', () => {
  it('baslik — aciklama formatindan cikarir', () => {
    const content = '# Task Master — Backlog Oncelik Siralayici\n\n> Detay...';
    assert.equal(extractDescription(content), 'Backlog Oncelik Siralayici');
  });

  it('blockquote fallback', () => {
    const content = '# Task Master\n\n> Backlog gorevlerini puanlar ve siralar.';
    assert.equal(extractDescription(content), 'Backlog gorevlerini puanlar ve siralar.');
  });

  it('dosya adindan fallback', () => {
    const content = '## Step 1\n\nIcerik...';
    assert.equal(extractDescription(content), 'Agentic workflow komutu');
  });

  it('em dash (—) olmadan tire (-) ile de calisir', () => {
    const content = '# Bug Hunter - Otonom Bug Avcisi\n\nIcerik...';
    assert.equal(extractDescription(content), 'Otonom Bug Avcisi');
  });
});

describe('adaptInvokeSyntax', () => {
  const input = 'Kullanim: `/task-master`\nAyrica `/task-conductor top 5` deneyin.\n`/bug-hunter <tanim>` ile baslatin.';

  it('gemini — degismez', () => {
    assert.equal(adaptInvokeSyntax(input, 'gemini'), input);
  });

  it('codex — / → $', () => {
    const result = adaptInvokeSyntax(input, 'codex');
    assert.ok(result.includes('`$task-master`'));
    assert.ok(result.includes('`$task-conductor top 5`'));
    assert.ok(result.includes('`$bug-hunter <tanim>`'));
  });

  it('kimi — / → /skill:', () => {
    const result = adaptInvokeSyntax(input, 'kimi');
    assert.ok(result.includes('`/skill:task-master`'));
    assert.ok(result.includes('`/skill:task-conductor top 5`'));
  });

  it('opencode — / → @', () => {
    const result = adaptInvokeSyntax(input, 'opencode');
    assert.ok(result.includes('`@task-master`'));
    assert.ok(result.includes('`@task-conductor top 5`'));
  });

  it('backtick disindaki /path/to/file gibi yollara dokunmaz', () => {
    const safe = 'Dosya: /usr/local/bin/test ve `cd ../Codebase/`';
    assert.equal(adaptInvokeSyntax(safe, 'codex'), safe);
  });
});

describe('adaptPathReferences', () => {
  it('codex — .claude/commands/ → .codex/skills/', () => {
    const input = 'Bkz: `.claude/commands/task-master.md`';
    const result = adaptPathReferences(input, 'codex');
    assert.ok(result.includes('.codex/skills/'));
  });

  it('kimi — .claude/agents/ → .kimi/agents/', () => {
    const input = '`.claude/agents/code-review.md` dosyasi';
    const result = adaptPathReferences(input, 'kimi');
    assert.ok(result.includes('.kimi/agents/'));
  });

  it('.claude/hooks/ ve .claude/tracking/ referanslari kaldirilir', () => {
    const input = 'Hook: `.claude/hooks/test.js` ve tracking: `.claude/tracking/`';
    const result = adaptPathReferences(input, 'gemini');
    assert.ok(!result.includes('.claude/hooks/'));
    assert.ok(!result.includes('.claude/tracking/'));
  });

  it('.claude/rules/ referansi kaldirilir', () => {
    const input = '`.claude/rules/workflow.md` dosyasina bakin';
    const result = adaptPathReferences(input, 'codex');
    assert.ok(!result.includes('.claude/rules/'));
  });

  it('CLAUDE.md → hedef context dosyasi', () => {
    const input = '`CLAUDE.md` dosyasi ana context';
    const result = adaptPathReferences(input, 'gemini');
    assert.ok(result.includes('GEMINI.md'));
  });
});
