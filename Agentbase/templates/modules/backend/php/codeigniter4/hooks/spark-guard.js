#!/usr/bin/env node

/**
 * spark-guard.js
 * PreToolUse (Bash) hook
 *
 * Tehlikeli CodeIgniter 4 spark komutlarini tespit eder ve engeller/uyarir.
 * Migration komutlari ORM modulu tarafindan da kontrol edilebilir; bu hook
 * ozellikle yikici veya operasyonel etkisi yuksek spark komutlarini ele alir.
 */

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
  });
}

const DANGEROUS_COMMANDS = [
  {
    pattern: /spark\s+migrate:refresh\b/i,
    decision: 'block',
    reason:
      "php spark migrate:refresh tum migration'lari geri alip yeniden uygular. " +
      'Bu komut veri kaybi veya geri alinmasi zor durumlara yol acabilir. ' +
      'Daha dar kapsamli migration adimlarini tercih edin.'
  },
  {
    pattern: /spark\s+migrate:rollback\b/i,
    decision: 'warn',
    reason:
      "php spark migrate:rollback migration batch'lerini geri alir. " +
      'Yanlis ortamda calistirilirsa veri modeli beklenmedik bicimde gerileyebilir. ' +
      "Hangi batch'in etkilenecegini once dogrulayin."
  },
  {
    pattern: /spark\s+db:seed\b/i,
    decision: 'warn',
    reason:
      'php spark db:seed veri ekler veya mevcut kayitlarla cakisabilir. ' +
      'Ozellikle production benzeri ortamlarda seed komutlarini dikkatle kullanin.'
  },
  {
    pattern: /spark\s+cache:clear\b/i,
    decision: 'info',
    reason:
      "php spark cache:clear uygulama cache'ini temizler. " +
      'Gelistirme ortaminda guvenlidir ancak beklenen performans farklarini maskeleyebilir.'
  }
];

async function main() {
  try {
    const input = await readStdin();
    const parsed = JSON.parse(input);
    const command = parsed?.tool_input?.command || '';

    if (!/spark/i.test(command)) return;

    for (const rule of DANGEROUS_COMMANDS) {
      if (rule.pattern.test(command)) {
        if (rule.decision === 'block') {
          process.stdout.write(JSON.stringify({
            decision: 'block',
            reason: rule.reason
          }));
        } else {
          const prefix = rule.decision === 'warn' ? 'WARN' : 'INFO';
          process.stdout.write(JSON.stringify({
            systemMessage: `${prefix}: ${rule.reason}`
          }));
        }
        return;
      }
    }
  } catch (e) {
    // Hook hatalari sessizce yutulur; workflow'u bloklamamali.
  }
}

main();
