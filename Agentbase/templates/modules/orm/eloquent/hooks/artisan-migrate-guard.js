#!/usr/bin/env node
/**
 * artisan-migrate-guard.js — PreToolUse (Bash) hook
 * Tehlikeli artisan migration komutlarini bloklar.
 */
const { runGuard } = require(require('path').join(__dirname, 'shared-hook-utils.js'));
runGuard([
  { pattern: /artisan\s+migrate:fresh/i, decision: 'block', reason: 'artisan migrate:fresh YASAK. Tum tablolari silip sifirdan baslar.' },
  { pattern: /artisan\s+migrate:reset/i, decision: 'block', reason: 'artisan migrate:reset YASAK. Tum migration lari geri alir.' },
  { pattern: /artisan\s+db:wipe/i, decision: 'block', reason: 'artisan db:wipe YASAK. Tum tablo, view ve type lari siler.' },
  { match: (cmd) => { const m = cmd.match(/artisan\s+migrate:rollback\s+.*--step[=\s]+(\d+)/i); return m && parseInt(m[1], 10) >= 10; }, decision: 'warn', reason: 'migrate:rollback cok fazla adim geri aliyor. Veri kaybi riski.' },
]);
