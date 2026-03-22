#!/usr/bin/env node
/**
 * Test Reminder Hook
 * Bootstrap tarafindan uretilmistir.
 * PostToolUse (Edit|Write) — degisiklik yapilan katman icin test calistirma hatirlatmasi.
 *
 * Hook davranisi:
 * - Edit veya Write tool'u calistirildiginda tetiklenir
 * - Degisiklik yapilan dosyanin hangi katmana ait oldugunu tespit eder
 * - O katman icin test komutu onerisi yapar
 * - Ayni katman icin tekrar tekrar uyari vermez (state ile takip)
 * - stdin'den gelen veriyi her zaman stdout'a yazar (non-blocking)
 */

const fs = require('fs');
const path = require('path');

// ─── GENERATE BOLUMU BASLANGIC ───
// Bootstrap bu bolumu manifest'teki subproject ve test bilgilerine gore doldurur.
// Manuel duzenleme yapmayin — degisiklikler Bootstrap tarafindan ezilir.

// Katman-test eslesmesi — her subproject icin bir entry
const LAYER_TESTS = [
  /* GENERATE: LAYER_TESTS
   * Bootstrap manifest.project.subprojects[] ve manifest.stack.test_commands bilgilerini
   * kullanarak her katman icin bir test eslesmesi uretir.
   *
   * Her entry icin:
   *   pattern:  Dosya yolunu eslestiren regex (subproject dizin yapisina gore)
   *   layer:    Katman/subproject adi
   *   command:  Test calistirma komutu (manifest.stack.test_commands'dan)
   *   extra:    Opsiyonel ek talimat (ornegin migration gerektiren degisiklikler icin)
   *
   * Ornek (Node.js API + Expo Mobile + Vite Web projesi):
   *
   * {
   *   pattern: /api\/src\/(controllers|services|middleware|validators|routes)\//,
   *   layer: 'API',
   *   command: 'cd ../Codebase/api && npm test',
   *   extra: null
   * },
   * {
   *   pattern: /api\/prisma\//,
   *   layer: 'API (Schema)',
   *   command: 'cd ../Codebase/api && npx prisma generate && npm test',
   *   extra: 'Prisma schema degisti — migration gerekebilir: npx prisma migrate dev'
   * },
   * {
   *   pattern: /mobile\/src\/(screens|components|services|context|navigation)\//,
   *   layer: 'Mobile',
   *   command: 'cd ../Codebase/mobile && npm test',
   *   extra: null
   * },
   * {
   *   pattern: /web\/src\//,
   *   layer: 'Web',
   *   command: 'cd ../Codebase/web && npm test',
   *   extra: null
   * },
   *
   * Ornek (Django projesi):
   *
   * {
   *   pattern: /app\/(views|models|serializers|services)\//,
   *   layer: 'Backend',
   *   command: 'cd ../Codebase && python manage.py test',
   *   extra: null
   * },
   * {
   *   pattern: /app\/migrations\//,
   *   layer: 'Backend (Migration)',
   *   command: 'cd ../Codebase && python manage.py test',
   *   extra: 'Migration dosyasi degisti — migrate calistirmayi unutma'
   * },
   */
  /* END GENERATE */
];

// Kontrol edilecek kod dosya uzantilari
const CODE_EXTENSIONS = [
  /* GENERATE: CODE_EXTENSIONS
   * Bootstrap tespit edilen stack'e gore kod dosya uzantilarini doldurur.
   * Sadece "kod" dosyalari dahil edilir (config dosyalari haric).
   *
   * Node.js/TypeScript: '.ts', '.tsx', '.js', '.jsx'
   * Python:             '.py'
   * PHP:                '.php'
   * Ruby:               '.rb'
   * Go:                 '.go'
   * Rust:               '.rs'
   * Java:               '.java', '.kt'
   *
   * Ornek (Node.js + PHP projesi):
   * '.ts', '.tsx', '.js', '.jsx', '.php'
   */
  /* END GENERATE */
];

// ─── GENERATE BOLUMU BITIS ───

// === FIXED LOGIC (degismez) ===

// State: hangi katmanlar icin zaten uyari verildi
// Her oturumda sifirlanir (process basina state)
const notifiedLayers = new Set();

// State dosyasi — oturumler arasi takip icin
const STATE_FILE = path.join(__dirname, '.test-reminder-state.json');

/**
 * State'i diskten yukle (varsa)
 */
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      const now = Date.now();
      // 30 dakikadan eski state'i temizle
      if (data.timestamp && (now - data.timestamp) < 30 * 60 * 1000) {
        (data.layers || []).forEach(l => notifiedLayers.add(l));
      }
    }
  } catch {
    // State okunamazsa sifirdan basla
  }
}

/**
 * State'i diske kaydet
 */
function saveState() {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify({
      timestamp: Date.now(),
      layers: Array.from(notifiedLayers)
    }));
  } catch {
    // State yazilamazsa sessizce devam et
  }
}

/**
 * Dosya yolunu LAYER_TESTS pattern'lerine karsi esle
 */
function detectLayer(filePath) {
  for (const entry of LAYER_TESTS) {
    if (entry.pattern.test(filePath)) {
      return entry;
    }
  }
  return null;
}

/**
 * Ana hook fonksiyonu
 */
async function main() {
  let inputData = '';

  process.stdin.on('data', chunk => {
    inputData += chunk;
  });

  process.stdin.on('end', () => {
    try {
      const input = JSON.parse(inputData);
      const filePath = input.tool_input?.file_path;

      // file_path yoksa — gecir
      if (!filePath) {
        console.log(inputData);
        process.exit(0);
      }

      // Kod dosyasi degilse — gecir
      const ext = path.extname(filePath).toLowerCase();
      if (CODE_EXTENSIONS.length > 0 && !CODE_EXTENSIONS.includes(ext)) {
        console.log(inputData);
        process.exit(0);
      }

      // State'i yukle
      loadState();

      // Katman tespiti
      const layerInfo = detectLayer(filePath);

      if (layerInfo && !notifiedLayers.has(layerInfo.layer)) {
        // Bu katman icin ilk kez uyari veriliyor
        notifiedLayers.add(layerInfo.layer);
        saveState();

        console.error('');
        console.error(`[Test Hatirlatma] ${layerInfo.layer} katmaninda degisiklik yapildi`);
        console.error(`  Dosya: ${path.basename(filePath)}`);
        console.error(`  Test komutu: ${layerInfo.command}`);

        if (layerInfo.extra) {
          console.error(`  Not: ${layerInfo.extra}`);
        }

        console.error('');
      }

      // Her zaman orijinal input'u stdout'a yaz
      console.log(inputData);
    } catch {
      // Parse hatasi — sessizce gecir
      console.log(inputData);
    }

    process.exit(0);
  });
}

main();
