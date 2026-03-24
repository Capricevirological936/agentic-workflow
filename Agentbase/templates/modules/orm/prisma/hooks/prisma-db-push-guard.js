#!/usr/bin/env node
/**
 * prisma-db-push-guard.js — PreToolUse (Bash) hook
 * prisma db push komutunu engeller.
 */
const { runGuard } = require(require('path').join(__dirname, 'shared-hook-utils.js'));
runGuard([{ pattern: /prisma\s+db\s+push/i, decision: 'block', reason: 'prisma db push YASAK. Migration dosyasi olmadan DB\'yi degistirir. Dogru komut: npx prisma migrate dev --name {aciklama}' }]);
