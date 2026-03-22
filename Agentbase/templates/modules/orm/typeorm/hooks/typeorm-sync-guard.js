#!/usr/bin/env node

/**
 * typeorm-sync-guard.js
 * PreToolUse (Bash) hook
 *
 * Tehlikeli TypeORM komutlarini bloklar:
 * - typeorm schema:sync  — migration dosyasi olmadan DB'yi degistirir
 * - typeorm schema:drop  — tum tablolari siler
 * - synchronize: true    — config dosyalarinda tespit edilirse uyari
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

    // typeorm schema:sync — migration olmadan DB'yi senkronize eder
    if (/typeorm\s+schema:sync/i.test(command) || /typeorm.*schema\s+sync/i.test(command)) {
      const result = {
        decision: 'block',
        reason: 'typeorm schema:sync YASAK. Migration dosyasi olmadan veritabani semasini degistirir. ' +
          'Dogru komut: npx typeorm migration:generate -- -n <MigrationAdi> && npx typeorm migration:run'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // typeorm schema:drop — tum tablolari siler
    if (/typeorm\s+schema:drop/i.test(command) || /typeorm.*schema\s+drop/i.test(command)) {
      const result = {
        decision: 'block',
        reason: 'typeorm schema:drop YASAK. Veritabanindaki tum tablolari siler. ' +
          'Bu komutun guvenli bir alternatifi yoktur.'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // typeorm migration:revert (uyari)
    if (/typeorm\s+migration:revert/i.test(command) || /typeorm.*migration\s+revert/i.test(command)) {
      const result = {
        systemMessage: '\u26a0\ufe0f **UYARI:** `typeorm migration:revert` son migration\'i geri alir. ' +
          'Bu islem veri kaybina yol acabilir. Devam etmeden once veri yedeginiz oldugundan emin olun.'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // synchronize: true iceren komutlar (ornegin config duzenleme veya env ayari)
    if (/synchronize\s*[:=]\s*true/i.test(command)) {
      const result = {
        systemMessage: '\u26a0\ufe0f **UYARI:** `synchronize: true` kullanmak production ortaminda tehlikelidir. ' +
          'TypeORM otomatik olarak entity degisikliklerini DB\'ye yansitir ve veri kaybina yol acabilir. ' +
          'Bunun yerine migration kullanin.'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // Eslesmezse sessizce cik
  } catch (e) {
    // Hook hatalari sessizce yutulur, workflow'u bloklamamali
  }
}

main();
