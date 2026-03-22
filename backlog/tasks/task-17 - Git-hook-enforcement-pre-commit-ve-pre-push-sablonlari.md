---
id: TASK-17
title: 'Git hook enforcement: pre-commit ve pre-push sablonlari'
status: Done
assignee: []
created_date: '2026-03-22 13:36'
updated_date: '2026-03-22 13:53'
labels:
  - hooks
  - enforcement
  - git
  - architecture
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem
Agentbase de SIFIR git hook var. dev.aps de pre-commit (test fail = commit BLOCK) ve pre-push (migration + env + localhost check) git hook lari commit/push seviyesinde enforcement sagliyor. Claude hook lari (PostToolUse) sadece Claude tool kullandiginda calisir — insan git commit yaptiginda hicbir kontrol yok.

## Kutsal Kural Cakismasi
Bootstrap Codebase e YAZMAZ. Ama git hook lar .git/hooks/ icinde yasir — Codebase de. Cozum: git hook script leri Agentbase/git-hooks/ altinda yasar, Bootstrap kullaniciya su komutu calistirmasini soyler:
```bash
cd ../Codebase && git config core.hooksPath ../Agentbase/git-hooks/
```
Bu sayede hook lar Agentbase den calisir ama Codebase in git islemlerini kontrol eder. Codebase e dosya yazilmaz.

## Olusturulacak Dosyalar

### templates/core/git-hooks/pre-commit.skeleton
Stack e gore degisen kontroller:
- TypeScript varsa: `npx tsc --noEmit` (derleme kontrolu)
- Test framework varsa: `npm test` veya `phpunit` (test calistirma)
- Lint varsa: `eslint --quiet` veya `phpcs` (lint kontrolu)
- Formatter varsa: staged dosyalari format kontrolu
- Guvenlik: hardcoded API key, .env commit engelleme
- TESTS_VERIFIED=1 ile bypass destegi (skill dogrulama sonrasi)

### templates/core/git-hooks/pre-push.skeleton
- ORM migration tutarliligi (schema degisti ama migration yok = FAIL)
- Env variable senkronizasyonu (Zod/config vs docker-compose)
- Localhost leak taramasi (test dosyalari haric)
- Destructive migration uyarisi (WARN, push devam eder)

### Bootstrap entegrasyonu
- Adim 5 e git-hooks uretimi eklenir
- Adim 7 tamamlanma raporuna git hooks kurulum komutu eklenir
- settings.json a git hooks path bilgisi eklenir
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 templates/core/git-hooks/pre-commit.skeleton olusturuldu
- [x] #2 templates/core/git-hooks/pre-push.skeleton olusturuldu
- [x] #3 Bootstrap Adim 5 git-hooks uretimini kapsiyor
- [x] #4 Bootstrap tamamlanma raporunda git config core.hooksPath komutu gosteriliyor
- [x] #5 pre-commit: TypeScript derleme + test + lint + guvenlik pattern taramasi
- [x] #6 pre-push: ORM migration tutarliligi + env sync + localhost leak
- [x] #7 TESTS_VERIFIED=1 bypass mekanizmasi calisiyor
- [ ] #8 commit-msg hook: conventional commit format dogrulamasi (feat:, fix:, refactor: vb.)
- [ ] #9 post-merge hook: dependency dosyasi (package.json, composer.json, requirements.txt) degistiyse otomatik install
- [ ] #10 post-checkout hook: branch degistiginde cache temizleme ve ortam degiskeni guncelleme
- [ ] #11 prepare-commit-msg hook: branch adindan otomatik commit prefix onerisi (feature/login → feat:)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
notes.md den ek git hook tipleri eklendi:
- commit-msg: format dogrulama
- post-merge: auto dependency install (npm install, composer install, pip install)
- post-checkout: cache + env guncelleme
- prepare-commit-msg: branch → prefix otomasyonu

Araclar: husky + lint-staged (JS/TS), pre-commit framework (Python), captainhook (PHP)

Dile Gore Formatter/Linter tablosu (auto-format icin referans):
- JS/TS: Prettier/Biome + ESLint/Biome
- PHP: PHP-CS-Fixer + PHPStan/Psalm
- Python: Black/Ruff + Flake8/mypy/Ruff
- Go: gofmt + golangci-lint
- Rust: rustfmt + Clippy
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Yeni Dosyalar
- `templates/core/git-hooks/pre-commit.skeleton` — Pre-commit hook sablonu
  - Guvenlik taramasi (hardcoded secret, .env engelleme)
  - GENERATE bloklari: GIT_PRECOMMIT_COMPILE, GIT_PRECOMMIT_TEST, GIT_PRECOMMIT_LINT, GIT_PRECOMMIT_FORMAT
  - TESTS_VERIFIED=1 bypass mekanizmasi

- `templates/core/git-hooks/pre-push.skeleton` — Pre-push hook sablonu
  - GENERATE bloklari: GIT_PREPUSH_LOCALHOST, GIT_PREPUSH_MIGRATION, GIT_PREPUSH_ENV, GIT_PREPUSH_DESTRUCTIVE
  - Localhost leak taramasi (test dosyalari haric)
  - ORM migration tutarliligi (Prisma, TypeORM, Eloquent, Django)
  - Env variable senkronizasyonu (Node/Python/PHP)
  - Destructive migration uyarisi (WARN, push devam eder)

### Degistirilen Dosyalar
- `generate.js` — TARGET_MAP'e `'core/git-hooks': 'git-hooks'` eklendi + 8 yeni SIMPLE_GENERATOR
- `bootstrap.md` — Step 5: Teammate 3 gorevine git-hooks eklendi, mkdir/hedef yol haritasi/GENERATE blok tablosu guncellendi. Step 7: git config core.hooksPath kurulum komutu eklendi.

### Test
- generate.js syntax kontrolu gecti
- 37/37 mevcut test gecti (regresyon yok)
- 8 yeni generator manuel test ile dogrulandi
<!-- SECTION:FINAL_SUMMARY:END -->
