#!/usr/bin/env node
/**
 * artisan-guard.js — PreToolUse (Bash) hook
 * Laravel framework-spesifik koruma.
 */
const { runGuard } = require(require('path').join(__dirname, 'shared-hook-utils.js'));
runGuard([
  { pattern: /artisan\s+db:wipe/i, decision: 'block', reason: 'artisan db:wipe TUM tablolari siler. YASAKTIR.' },
  { pattern: /artisan\s+tinker/i, decision: 'warn', reason: 'artisan tinker interaktif kabuktur, otomatik baglamda tehlikelidir.' },
  { pattern: /artisan\s+config:cache/i, decision: 'warn', reason: 'artisan config:cache gelistirmede .env degisikliklerini engeller.' },
  { pattern: /artisan\s+route:cache/i, decision: 'warn', reason: 'artisan route:cache closure-based rotalarda hata verir.' },
  { pattern: /artisan\s+key:generate/i, decision: 'warn', reason: 'artisan key:generate APP_KEY degistirir, mevcut veriler okunamaz olur.' },
  { pattern: /artisan\s+optimize:clear/i, decision: 'info', reason: 'artisan optimize:clear tum onbellekleri temizler.' },
], { preCheck: (cmd) => /artisan/i.test(cmd) });
