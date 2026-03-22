---
id: TASK-7
title: Deterministik skeleton isleme icin Node.js generate script
status: Done
assignee: []
created_date: '2026-03-22 10:49'
updated_date: '2026-03-22 12:09'
labels:
  - bootstrap
  - reliability
  - architecture
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Su an skeleton isleme tamamen Claude'un dogal dil yorumlamasina bagli. Bu idempotent degil — ayni manifest ile iki calistirmada farkli cikti uretebilir. Cozum: templates/ altindaki skeleton dosyalarini isleyen bir Node.js script yaz (generate.js). Script manifest.yaml okur, skeleton dosyalarini tarar, GENERATE bloklarini deterministik olarak doldurur, cikti dosyalarini yazar. Bootstrap roportaj + manifest uretimini yapar, sonra 'node generate.js Docs/agentic/project-manifest.yaml' calistirir. Bu approach'un avantajlari: (1) idempotent — ayni girdi = ayni cikti, (2) hizli — Claude token harcamaz, (3) test edilebilir — script unit test'lerle dogrulanabilir, (4) debug edilebilir — hata durumunda stack trace var. Dezavantaj: GENERATE bloklarinin icerigi artik sabit sablonlarla sinirli — generative zenginlik kaybolur. Hibrit yaklasim: basit bloklar (COMMIT_CONVENTION, VERIFICATION_COMMANDS) script ile, karmasik bloklar (CODEBASE_CONTEXT, PROJECT_CHECKLIST) Claude ile doldurulabilir.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 generate.js script'i manifest.yaml okuyup skeleton dosyalarini isliyor
- [x] #2 Basit GENERATE bloklari (path, komut listeleri) deterministik dolduruluyor
- [x] #3 Karmasik GENERATE bloklari Claude'a birakilmak uzere isaretleniyor
- [x] #4 Script unit test'leri yazildi
- [x] #5 Bootstrap Adim 5 hibrit moda guncellendi (script + Claude)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 2 — Guvenilirlik. TASK-3 ve TASK-12 tamamlandiktan sonra yapilmali. Script bu iki format kararini bilmeli.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Deterministik Skeleton İşleme: generate.js

### Oluşturulan Dosyalar

1. **`Agentbase/generate.js`** — Ana script (520+ satır)
   - Manifest.yaml okur, skeleton dosyalarını tarar
   - MD format (`<!-- GENERATE: X -->`) ve JS format (`/* GENERATE: X */ ... /* END GENERATE */`) GENERATE bloklarını parse eder
   - JSON format (`__GENERATE__X__`) koşullu blokları işler (aktif modül kontrolü, forbidden komutlar)
   - 20+ basit blok generator'ı: COMMIT_CONVENTION, VERIFICATION_COMMANDS, MIGRATION_COMMANDS, FILE_EXTENSIONS, CODE_EXTENSIONS, SECURITY_PATTERNS, LAYER_TESTS, PRISMA_PATH, LARAVEL_PATHS, DJANGO_PATHS, TYPEORM_PATHS, vb.
   - Karmaşık blokları `<!-- CLAUDE_FILL: BLOCK_NAME -->` marker'ı ile işaretler
   - CLI: `--dry-run`, `--verbose`, `--output-dir` flag'leri
   - Detaylı rapor çıktısı

2. **`Agentbase/generate.test.js`** — Unit testler (37 test, 12 suite)
   - MD/JS GENERATE blok parsing testleri
   - JSON koşullu blok işlemci testleri
   - Tüm basit generator testleri
   - Entegrasyon testleri (karma içerik)

3. **`Agentbase/package.json`** — Bağımlılıklar (js-yaml)

### Bootstrap Güncellemeleri (`bootstrap.md`)

4. **5.1.1 Hibrit Mod: Script-First Yaklaşım** bölümü eklendi
   - Adım A: generate.js deterministik işleme
   - Adım B: Teammate'ler CLAUDE_FILL marker'larını doldurur
   - Fallback: Script hata verirse klasik teammate-only moda geçiş

5. **5.2 Teammate prompt formatı** güncellendi
   - CLAUDE_FILL marker önceliği tanımlandı
   - generate.js çıktılarını koruma kuralı eklendi
<!-- SECTION:FINAL_SUMMARY:END -->
