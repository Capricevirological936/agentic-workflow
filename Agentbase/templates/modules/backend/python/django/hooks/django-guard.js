#!/usr/bin/env node
/**
 * django-guard.js — PreToolUse (Bash) hook
 * Django framework-spesifik koruma. Migration-disi tehlikeli komutlar.
 */
const { readStdin } = require(require('path').join(__dirname, 'shared-hook-utils.js'));

const DANGEROUS_COMMANDS = [
  { pattern: /manage\.py\s+flush\b/i, decision: 'block', reason: 'manage.py flush TUM veritabani verilerini siler. YASAKTIR.' },
  { pattern: /manage\.py\s+shell\b/i, decision: 'warn', reason: 'manage.py shell interaktif kabuktur, otomatik baglamda tehlikelidir.' },
  { pattern: /manage\.py\s+createsuperuser\b.*(?:--password|DJANGO_SUPERUSER_PASSWORD)/i, decision: 'block', reason: 'createsuperuser ile sifre komut satirinda acik yazilmamalidir. GUVENLIK RISKI.' },
  { pattern: /manage\.py\s+dbshell\b/i, decision: 'warn', reason: 'manage.py dbshell interaktif calismaz. Django ORM kullanin.' },
  { pattern: /manage\.py\s+loaddata\b/i, decision: 'warn', reason: 'manage.py loaddata mevcut verilerin ustune yazabilir.' },
  { pattern: /manage\.py\s+dumpdata\b/i, decision: 'info', reason: 'manage.py dumpdata hassas veriler icerebilir. Ciktiyi commit etmeyin.' },
  { pattern: /manage\.py\s+collectstatic\b/i, decision: 'info', reason: 'manage.py collectstatic gelistirmede genellikle gereksizdir.' },
];

async function main() {
  try {
    const input = await readStdin();
    const parsed = JSON.parse(input);
    const command = parsed?.tool_input?.command || '';
    if (!/manage\.py/i.test(command)) return;
    for (const rule of DANGEROUS_COMMANDS) {
      if (rule.pattern.test(command)) {
        if (rule.decision === 'block') {
          process.stdout.write(JSON.stringify({ decision: 'block', reason: rule.reason }));
        } else {
          const prefix = rule.decision === 'warn' ? '\u26a0\ufe0f UYARI' : '\u2139\ufe0f BILGI';
          process.stdout.write(JSON.stringify({ systemMessage: `${prefix}: ${rule.reason}` }));
        }
        return;
      }
    }
  } catch (e) { /* sessiz */ }
}
if (require.main === module) main();
