#!/usr/bin/env node

/**
 * artisan-migrate-guard.js
 * PreToolUse (Bash) hook
 *
 * Tehlikeli artisan migration komutlarini bloklar:
 * - artisan migrate:fresh  — tum tablolari silip sifirdan olusturur
 * - artisan migrate:reset  — tum migration'lari geri alir
 * - artisan db:wipe         — tum tablo, view ve type'lari siler
 * - artisan migrate:rollback --step=999 gibi buyuk step'ler icin uyari
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

    const command = parsed?.tool_input?.command || '';

    // artisan migrate:fresh — tum tablolari siler ve migration'lari sifirdan calistirir
    if (/artisan\s+migrate:fresh/i.test(command)) {
      const result = {
        decision: 'block',
        reason: 'artisan migrate:fresh YASAK. Tum tablolari silip migration\'lari sifirdan calistirir. Dogru komut: php artisan migrate'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // artisan migrate:reset — tum migration'lari geri alir
    if (/artisan\s+migrate:reset/i.test(command)) {
      const result = {
        decision: 'block',
        reason: 'artisan migrate:reset YASAK. Tum migration\'lari geri alir. Tek adim geri almak icin: php artisan migrate:rollback'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // artisan db:wipe — tum DB nesnelerini siler
    if (/artisan\s+db:wipe/i.test(command)) {
      const result = {
        decision: 'block',
        reason: 'artisan db:wipe YASAK. Tum tablo, view ve type\'lari siler. Bu komutun guvenli bir alternatifi yoktur.'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // artisan migrate:rollback --step=N (buyuk step icin uyari)
    const rollbackMatch = command.match(/artisan\s+migrate:rollback\s+.*--step[=\s]+(\d+)/i);
    if (rollbackMatch) {
      const steps = parseInt(rollbackMatch[1], 10);
      if (steps >= 10) {
        const result = {
          systemMessage: `\u26a0\ufe0f **UYARI:** \`migrate:rollback --step=${steps}\` cok fazla migration'i geri alir. ` +
            `Bu islem veri kaybina yol acabilir. Gercekten ${steps} adim geri almak istediginizden emin misiniz?`
        };
        process.stdout.write(JSON.stringify(result));
        return;
      }
    }

    // Eslesmezse sessizce cik
  } catch (e) {
    // Hook hatalari sessizce yutulur, workflow'u bloklamamali
  }
}

main();
