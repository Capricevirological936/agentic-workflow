#!/usr/bin/env node

/**
 * django-guard.js
 * PreToolUse (Bash) hook
 *
 * Django leaf'i icin framework-spesifik koruma saglar.
 * Tehlikeli Django manage.py komutlarini tespit eder ve engeller/uyarir.
 * Migration komutlari orm/django-orm modulu tarafindan yonetilir,
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
 * Tehlikeli manage.py komutlari ve seviyeleri.
 * - block: Komutu tamamen engelle
 * - warn: Uyari mesaji goster ama engelleme
 * - info: Bilgilendirme mesaji goster
 */
const DANGEROUS_COMMANDS = [
  {
    pattern: /manage\.py\s+flush\b/i,
    decision: 'block',
    reason:
      'manage.py flush TUM veritabani verilerini siler (tablolari korur ama icerigini bosaltir). ' +
      'Bu komut YASAKTIR. Veritabanini sifirlamak icin migration rollback veya test fixture kullanin.'
  },
  {
    pattern: /manage\.py\s+shell\b/i,
    decision: 'warn',
    reason:
      'manage.py shell interaktif Python kabugusdur ve otomatik baglamda tehlikelidir. ' +
      'Veritabaninda dogrudan degisiklik yapabilir, geri alinamaz islemlere yol acabilir. ' +
      'Bunun yerine ozel bir management command yazmayi deneyin.'
  },
  {
    pattern: /manage\.py\s+createsuperuser\b.*(?:--password|DJANGO_SUPERUSER_PASSWORD)/i,
    decision: 'block',
    reason:
      'createsuperuser komutu ile sifre komut satirinda veya ortam degiskeninde acik yazilmamalidir. ' +
      'GUVENLIK RISKI: Sifre shell gecmisine veya loglara kaydedilebilir. ' +
      'Interaktif olarak calistirin veya guvenli bir secrets manager kullanin.'
  },
  {
    pattern: /manage\.py\s+dbshell\b/i,
    decision: 'warn',
    reason:
      'manage.py dbshell dogrudan veritabani kabugun acari. ' +
      'Otomatik baglamda interaktif olarak calismaz. ' +
      'SQL sorgulari icin Django ORM veya management command kullanin.'
  },
  {
    pattern: /manage\.py\s+loaddata\b/i,
    decision: 'warn',
    reason:
      'manage.py loaddata fixture verilerini yukler. ' +
      'Mevcut verilerin ustune yazabilir veya unique constraint ihlali yapabilir. ' +
      'Production ortaminda dikkatli kullanin.'
  },
  {
    pattern: /manage\.py\s+dumpdata\b/i,
    decision: 'info',
    reason:
      'manage.py dumpdata veritabani verilerini JSON/YAML olarak disari aktarir. ' +
      'Hassas veriler (kullanici bilgileri, sifreler) icerebilir. ' +
      'Ciktiyi commit etmeyin ve hassas modelleri --exclude ile haric tutun.'
  },
  {
    pattern: /manage\.py\s+collectstatic\b/i,
    decision: 'info',
    reason:
      'manage.py collectstatic statik dosyalari toplar. ' +
      'Gelistirme ortaminda genellikle gereksizdir (Django dev server statik dosyalari otomatik sunar). ' +
      'Production deploy oncesinde calistirilmali.'
  }
];

/**
 * DEBUG=True gostergelerini kontrol et.
 * manage.py komutlarinda DEBUG=True ile calistirma uyarisi.
 */
function checkDebugMode(command) {
  if (/DEBUG\s*=\s*True/i.test(command) || /--settings.*production/i.test(command) === false && /runserver/i.test(command)) {
    // runserver zaten dev icin — ayri kontrol edilecek durumlar icin
    return null;
  }

  if (/DEBUG\s*=\s*True/i.test(command)) {
    return {
      systemMessage:
        '⚠️ UYARI: DEBUG=True ile calistirma tespit edildi. ' +
        'Production ortaminda DEBUG ASLA True olmamalidir. ' +
        'Detayli hata mesajlari, stack trace ve konfigurasyonlar disariya sizabilir.'
    };
  }

  return null;
}

async function main() {
  try {
    const input = await readStdin();
    const parsed = JSON.parse(input);

    const command = parsed?.tool_input?.command || '';

    // manage.py komutu icerip icermedigini kontrol et
    if (!/manage\.py/i.test(command)) return;

    // DEBUG=True kontrolu
    const debugResult = checkDebugMode(command);
    if (debugResult) {
      process.stdout.write(JSON.stringify(debugResult));
      return;
    }

    // Tehlikeli komut kontrolu
    for (const rule of DANGEROUS_COMMANDS) {
      if (rule.pattern.test(command)) {
        if (rule.decision === 'block') {
          const result = {
            decision: 'block',
            reason: rule.reason
          };
          process.stdout.write(JSON.stringify(result));
        } else {
          const prefix = rule.decision === 'warn' ? '⚠️ UYARI' : 'ℹ️ BILGI';
          const result = {
            systemMessage: `${prefix}: ${rule.reason}`
          };
          process.stdout.write(JSON.stringify(result));
        }
        return;
      }
    }

    // Eslesen kural yoksa sessizce cik
  } catch (e) {
    // Hook hatalari sessizce yutulur, workflow'u bloklamamali
  }
}

main();
