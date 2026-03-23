'use strict';

/**
 * shared-patterns.js — session-tracker ve session-monitor arasinda
 * paylasilan yardimci fonksiyonlar.
 *
 * Her iki dosya bu modulu require ederek ayni pattern setini kullanir.
 * DRY prensibi: test komutu tespiti tek yerde tanimlaniyor.
 */

const TEST_COMMAND_PATTERNS = [
  /\b(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?test\b/i,
  /\bnode\s+--test\b/i,
  /\bjest\b/i,
  /\bvitest\b/i,
  /\bpytest\b/i,
  /\bphpunit\b/i,
  /\bcargo\s+test\b/i,
  /\bgo\s+test\b/i,
];

/**
 * Komutun bir test komutu olup olmadigini kontrol eder.
 * @param {string} command - Bash komutu
 * @returns {boolean}
 */
function isTestCommand(command) {
  if (!command) return false;
  return TEST_COMMAND_PATTERNS.some(p => p.test(command));
}

module.exports = {
  TEST_COMMAND_PATTERNS,
  isTestCommand,
};
