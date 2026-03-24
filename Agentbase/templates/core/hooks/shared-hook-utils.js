'use strict';

/**
 * shared-hook-utils.js — Hook ortak yardimci fonksiyonlari
 * Tum hook'lar ayni readStdin/createGuardHook pattern'ini kullanir.
 */

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
  });
}

function createGuardHook(rules, options = {}) {
  const { field = 'command', preCheck } = options;
  return async function guardHook() {
    try {
      const input = await readStdin();
      const parsed = JSON.parse(input);
      let target;
      if (field === 'command') {
        target = parsed?.tool_input?.command || '';
      } else {
        target = parsed?.tool_input?.file_path || parsed?.tool_input?.path || '';
      }
      if (preCheck && !preCheck(target, parsed)) return;
      for (const rule of rules) {
        const match = typeof rule.match === 'function' ? rule.match(target, parsed) : rule.pattern.test(target);
        if (match) {
          if (rule.decision === 'block') {
            process.stdout.write(JSON.stringify({ decision: 'block', reason: rule.reason }));
          } else {
            const prefix = rule.decision === 'warn' ? '\u26a0\ufe0f UYARI' : '\u2139\ufe0f BILGI';
            process.stdout.write(JSON.stringify({ systemMessage: prefix + ': ' + rule.reason }));
          }
          return;
        }
      }
    } catch (e) { /* Hook hatalari sessizce yutulur */ }
  };
}

function runGuard(rules, options) {
  return createGuardHook(rules, options)();
}

module.exports = { readStdin, createGuardHook, runGuard };
