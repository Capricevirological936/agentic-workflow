#!/usr/bin/env node

/**
 * artisan-guard.js
 * PreToolUse (Bash) hook
 *
 * Laravel leaf'i icin framework-spesifik koruma saglar.
 * Tehlikeli artisan komutlarini tespit eder ve engelller/uyarir.
 * Migration komutlari orm/eloquent modulu tarafindan yonetilir,
 * bu hook migration-disi tehlikeli komutlari kapsar.
 */

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
  });
}

/**
 * Tehlikeli artisan komutlari ve seviyeleri.
 * - block: Komutu tamamen engelle
 * - warn: Uyari mesaji goster ama engelleme
 * - info: Bilgilendirme mesaji goster
 */
const DANGEROUS_COMMANDS = [
  {
    pattern: /artisan\s+tinker/i,
    decision: 'warn',
    reason:
      'artisan tinker interaktif bir kabuktur ve otomatik baglamda tehlikelidir. ' +
      'Veritabaninda dogrudan degisiklik yapabilir, geri alinamaz islemlere yol acabilir. ' +
      'Bunun yerine ozel bir artisan komutu yazmayi veya test yazmay deneyin.'
  },
  {
    pattern: /artisan\s+config:cache/i,
    decision: 'warn',
    reason:
      'artisan config:cache production icin konfigurasyonu onbellegeler. ' +
      'Gelistirme ortaminda .env degisiklikleri yansimaz hale gelir. ' +
      'Eger gelistirme ortamindaysaniz once `artisan config:clear` calistirin.'
  },
  {
    pattern: /artisan\s+route:cache/i,
    decision: 'warn',
    reason:
      'artisan route:cache rotalari onbellegeler. ' +
      'Closure-based rotalar varsa hata verir. ' +
      'Sadece tum rotalariniz controller-based ise kullanin.'
  },
  {
    pattern: /artisan\s+optimize:clear/i,
    decision: 'info',
    reason:
      'artisan optimize:clear tum onbellekleri temizler (config, route, view, event). ' +
      'Gelistirme ortaminda guvenlidir, production\'da performans etkisi olabilir.'
  },
  {
    pattern: /artisan\s+db:wipe/i,
    decision: 'block',
    reason:
      'artisan db:wipe TUM tablolari siler. Bu komut YASAKTIR. ' +
      'Veritabanini sifirlamak icin `artisan migrate:fresh` (sadece DEV) kullanilabilir.'
  },
  {
    pattern: /artisan\s+key:generate/i,
    decision: 'warn',
    reason:
      'artisan key:generate APP_KEY\'i degistirir. ' +
      'Mevcut sifrelenmis veriler (session, cookie) okunamaz hale gelir. ' +
      'Production\'da calistirmak kullanici oturumlarini dusurur.'
  },
  {
    pattern: /artisan\s+storage:link/i,
    decision: 'info',
    reason:
      'artisan storage:link public/storage → storage/app/public symlink olusturur. ' +
      'Genellikle bir kez calistirilir. Tekrar calistirmak mevcut link\'i etkilemez.'
  }
];

async function main() {
  try {
    const input = await readStdin();
    const parsed = JSON.parse(input);

    const command = parsed?.tool_input?.command || '';

    // artisan komutu icerip icermedigini kontrol et
    if (!/artisan/i.test(command)) return;

    for (const rule of DANGEROUS_COMMANDS) {
      if (rule.pattern.test(command)) {
        if (rule.decision === 'block') {
          const result = {
            decision: 'block',
            reason: rule.reason
          };
          process.stdout.write(JSON.stringify(result));
        } else {
          // warn ve info icin systemMessage kullan
          const prefix = rule.decision === 'warn' ? '⚠️ UYARI' : 'ℹ️ BILGI';
          const result = {
            systemMessage: `${prefix}: ${rule.reason}`
          };
          process.stdout.write(JSON.stringify(result));
        }
        return; // Ilk eslesen kural uygulansins
      }
    }

    // Eslesen kural yoksa sessizce cik
  } catch (e) {
    // Hook hatalari sessizce yutulur, workflow'u bloklamamali
  }
}

main();
