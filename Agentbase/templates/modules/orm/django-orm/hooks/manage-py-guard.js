#!/usr/bin/env node
/**
 * manage-py-guard.js — PreToolUse (Bash) hook
 * Django management tehlikeli komut korumasi.
 */
const { runGuard } = require(require('path').join(__dirname, 'shared-hook-utils.js'));
runGuard([
  { pattern: /manage\.py\s+flush\b/i, decision: 'block', reason: 'manage.py flush YASAK. Tum verileri siler.' },
  { pattern: /manage\.py\s+reset_db\b/i, decision: 'block', reason: 'manage.py reset_db YASAK. DB yi tamamen silip yeniden olusturur.' },
  { pattern: /manage\.py\s+sqlflush\b/i, decision: 'warn', reason: 'manage.py sqlflush SQL gosterir. Dogrudan calistirmayin.' },
  { pattern: /manage\.py\s+migrate\b.*--fake\b|manage\.py\s+migrate\b.*--fake-initial\b/i, decision: 'warn', reason: '--fake migration i calistirmadan uygulanmis isaretler.' },
  { pattern: /manage\.py\s+migrate\s+\w+\s+zero\b/i, decision: 'warn', reason: 'migrate <app> zero tum migration lari geri alir.' },
]);
