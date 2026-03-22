#!/usr/bin/env node

/**
 * prisma-db-push-guard.js
 * PreToolUse (Bash) hook
 *
 * `prisma db push` komutunu engeller. Migration dosyasi olmadan
 * veritabanini degistirmek tehlikelidir, bunun yerine
 * `npx prisma migrate dev --name <aciklama>` kullanilmalidir.
 */

const path = require('path');

const CODEBASE_ROOT = path.resolve(__dirname, '../../../Codebase');

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
  });
}

async function main() {
  try {
    const input = await readStdin();
    const parsed = JSON.parse(input);

    // tool_input.command icindeki komutu kontrol et
    const command = parsed?.tool_input?.command || '';

    if (/prisma\s+db\s+push/i.test(command)) {
      const result = {
        decision: 'block',
        reason: 'prisma db push YASAK. Migration dosyasi olmadan DB\'yi degistirir. Dogru komut: npx prisma migrate dev --name {aciklama}'
      };
      process.stdout.write(JSON.stringify(result));
    }

    // Eslesmezse sessizce cik
  } catch (e) {
    // Hook hatalari sessizce yutulur, workflow'u bloklamamali
  }
}

main();
