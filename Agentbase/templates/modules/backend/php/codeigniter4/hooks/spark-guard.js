#!/usr/bin/env node
/**
 * spark-guard.js — PreToolUse (Bash) hook
 * CodeIgniter 4 spark koruması.
 */
const { runGuard } = require(require('path').join(__dirname, 'shared-hook-utils.js'));
runGuard([
  { pattern: /spark\s+migrate:refresh\b/i, decision: 'block', reason: 'spark migrate:refresh tum migration lari geri alip yeniden uygular.' },
  { pattern: /spark\s+migrate:rollback\b/i, decision: 'warn', reason: 'spark migrate:rollback batch leri geri alir.' },
  { pattern: /spark\s+db:seed\b/i, decision: 'warn', reason: 'spark db:seed mevcut kayitlarla cakisabilir.' },
  { pattern: /spark\s+cache:clear\b/i, decision: 'info', reason: 'spark cache:clear uygulama cache ini temizler.' },
], { preCheck: (cmd) => /spark/i.test(cmd) });
