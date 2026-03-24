#!/usr/bin/env node
/**
 * typeorm-sync-guard.js — PreToolUse (Bash) hook
 * Tehlikeli TypeORM komutlarini bloklar.
 */
const { runGuard } = require(require('path').join(__dirname, 'shared-hook-utils.js'));
runGuard([
  { pattern: /typeorm\s+schema:sync|typeorm.*schema\s+sync/i, decision: 'block', reason: 'typeorm schema:sync YASAK. Migration kullanin.' },
  { pattern: /typeorm\s+schema:drop|typeorm.*schema\s+drop/i, decision: 'block', reason: 'typeorm schema:drop YASAK. Tum tablolari siler.' },
  { pattern: /typeorm\s+migration:revert|typeorm.*migration\s+revert/i, decision: 'warn', reason: 'typeorm migration:revert veri kaybina yol acabilir.' },
  { pattern: /synchronize\s*[:=]\s*true/i, decision: 'warn', reason: 'synchronize: true production da tehlikelidir. Migration kullanin.' },
]);
