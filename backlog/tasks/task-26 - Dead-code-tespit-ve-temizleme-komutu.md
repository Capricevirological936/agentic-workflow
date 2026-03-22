---
id: TASK-26
title: Dead code tespit ve temizleme komutu
status: Done
assignee: []
created_date: '2026-03-22 13:56'
updated_date: '2026-03-22 15:04'
labels:
  - commands
  - maintenance
  - code-quality
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Kaynak
Orijinal workspace tasarimindaki shared/skills/maintenance/deadcode.md konsepti.

## Problem
Projelerde zaman icerisinde kullanilmayan kod birikir — kaldirilmis feature larin artiklari, unreachable branch ler, import edilmeyen moduller. Bunlar context kirliligi yaratir ve agent larin yanlis dosyalara odaklanmasina neden olur.

## Cozum
templates/core/commands/deadcode.skeleton.md — bagimsiz slash command olarak.

Akis:
1. Codebase i tara — kullanilmayan export lar, cagrilmayan fonksiyonlar, import edilmeyen dosyalar
2. Her bulguyu CONFIDENCE seviyesiyle siniflandir:
   - HIGH: hicbir yerden referans edilmiyor (grep ile dogrulandi)
   - MEDIUM: sadece test dosyalarindan referans ediliyor
   - LOW: dinamik import/reflection ile kullaniyor olabilir
3. HIGH confidence bulgulari icin otomatik temizlik onerisi
4. Kullanici onayi ile temizlik + commit
5. Rapor

Stack-spesifik araclar (GENERATE blogunda):
- JS/TS: ts-prune, knip, unimported
- Python: vulture, autoflake
- PHP: psalm --find-dead-code
- Go: staticcheck (U1000)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 templates/core/commands/deadcode.skeleton.md olusturuldu
- [x] #2 3 confidence seviyesi ile siniflandirma calisiyor (HIGH/MEDIUM/LOW)
- [x] #3 Stack-spesifik arac onerileri GENERATE blogunda
- [x] #4 Otomatik temizlik + kullanici onayi + commit akisi tanimlandi
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Yeni Dosya
- **templates/core/commands/deadcode.skeleton.md** — Dead code tespit ve temizleme komutu:
  - GENERATE bloklari: CODEBASE_CONTEXT, DEADCODE_TOOLS, COMMIT_CONVENTION
  - 3 confidence seviyesi: HIGH (hicbir referans yok), MEDIUM (sadece test referansi), LOW (dinamik import olabilir)
  - Stack-spesifik arac onerileri: knip/ts-prune (JS/TS), vulture (Python), psalm (PHP), staticcheck (Go)
  - Otomatik temizlik + kullanici onayi + commit akisi
  - Guvenlik kurallari: entry point, main, config dosyalarina dokunma
  - Monorepo destegi: subproject-aware tarama
<!-- SECTION:FINAL_SUMMARY:END -->
