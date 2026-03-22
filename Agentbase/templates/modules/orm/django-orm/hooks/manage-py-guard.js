#!/usr/bin/env node

/**
 * manage-py-guard.js
 * PreToolUse (Bash) hook
 *
 * Tehlikeli Django management komutlarini bloklar:
 * - manage.py flush         — tum verileri siler
 * - manage.py reset_db      — veritabanini silip yeniden olusturur
 * - manage.py sqlflush      — uyari (SQL gosterir ama calistirmaz)
 * - manage.py migrate --fake — uyari (migration'i calistirmadan uygulanmis olarak isaretler)
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

    // manage.py flush — tum verileri siler
    if (/manage\.py\s+flush\b/i.test(command)) {
      const result = {
        decision: 'block',
        reason: 'manage.py flush YASAK. Tum tablolardaki verileri siler (tablo yapilari korunur). ' +
          'Belirli verileri silmek icin Django shell veya ORM kullanin.'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // manage.py reset_db — veritabanini tamamen silip yeniden olusturur (django-extensions)
    if (/manage\.py\s+reset_db\b/i.test(command)) {
      const result = {
        decision: 'block',
        reason: 'manage.py reset_db YASAK. Veritabanini tamamen silip yeniden olusturur. ' +
          'Migration\'lari sifirlamak icin: python manage.py migrate <app> zero'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // manage.py sqlflush — SQL gosterir ama calistirmaz, yine de uyar
    if (/manage\.py\s+sqlflush\b/i.test(command)) {
      const result = {
        systemMessage: '\u26a0\ufe0f **UYARI:** `manage.py sqlflush` tum tablolari bosaltacak SQL\'i gosterir. ' +
          'Bu SQL\'i dogrudan calistirmayin. Sadece inceleme amacli kullanin.'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // manage.py migrate --fake — migration'i calistirmadan uygulanmis isaretler
    if (/manage\.py\s+migrate\b.*--fake\b/i.test(command) || /manage\.py\s+migrate\b.*--fake-initial\b/i.test(command)) {
      const result = {
        systemMessage: '\u26a0\ufe0f **UYARI:** `--fake` flagi migration\'i calistirmadan uygulanmis olarak isaretler. ' +
          'Bu, veritabani semasinin migration gecmisiyle uyumsuz hale gelmesine yol acabilir. ' +
          'Sadece veritabaninin zaten dogru durumda oldugunu biliyorsaniz kullanin.'
      };
      process.stdout.write(JSON.stringify(result));
      return;
    }

    // manage.py migrate zero — tum migration'lari geri alir (belirli app icin)
    if (/manage\.py\s+migrate\s+\w+\s+zero\b/i.test(command)) {
      const result = {
        systemMessage: '\u26a0\ufe0f **UYARI:** `migrate <app> zero` o app\'in tum migration\'larini geri alir. ' +
          'Bu islem ilgili tablolari silecektir. Devam etmeden once veri yedeginiz oldugundan emin olun.'
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
