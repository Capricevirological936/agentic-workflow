---
id: TASK-3
title: JS hook skeleton format uyumsuzlugunu coz
status: Done
assignee: []
created_date: '2026-03-22 10:48'
updated_date: '2026-03-22 11:06'
labels:
  - bootstrap
  - hooks
dependencies:
  - TASK-7
  - TASK-12
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Bootstrap tek bir skeleton isleme formati tanimliyor: <\!-- GENERATE: BLOCK_NAME -->. Ancak JS hook dosyalarinda HTML comment gecersiz syntax. Hook skeleton'lari /* GENERATED_SECURITY_PATTERNS */ kullanıyor. Bu iki format arasindaki farki Bootstrap'in Adim 5'inde acikca dokumante etmeli ve teammate talimatlarinda belirtmeli. Alternatif: tum skeleton'larda tek format kullan ve JS dosyalarinda da ayni formati destekle (ornegin isleme sirasinda once HTML comment'leri cikar, sonra JS'e yaz).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Bootstrap Adim 5 iki farkli skeleton formatini dokumante ediyor (MD ve JS)
- [x] #2 Teammate 3 (hook-generator) talimatinda JS-spesifik marker formati belirtildi
- [x] #3 Tum JS skeleton dosyalari tutarli marker formati kullaniyor
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 1 — Temel. Skeleton isleme kurallarini degistirir. TASK-7 ve TASK-12 buna bagimli.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### AC#1 — Bootstrap Adim 5 dokumantasyonu
- `bootstrap.md` Adim 5 Kurallar bolumune "Skeleton Marker Formatlari (Dosya Tipine Gore)" alt bolumu eklendi
- MD format (`<!-- GENERATE: NAME -->`) ve JS format (`/* GENERATE: NAME */` ... `/* END GENERATE */`) ayri ayri dokumante edildi

### AC#2 — Teammate 3 JS-spesifik talimat
- Teammate 3 (hook-generator) spawn planina `JS MARKER FORMATI` notu eklendi
- HTML comment yerine JS comment syntax kullanilacagi acikca belirtildi
- GENERATE Blok Haritasi tablosunda hook dosyalarina "(JS format)" etiketi eklendi

### AC#3 — JS skeleton tutarliligi
- `code-review-check.skeleton.js`: `GENERATED_SECURITY_PATTERNS` → `GENERATE: SECURITY_PATTERNS`, `GENERATED_EXTENSIONS` → `GENERATE: FILE_EXTENSIONS`, `END GENERATE` marker'lari eklendi
- `test-reminder.skeleton.js`: `GENERATED_LAYER_TESTS` → `GENERATE: LAYER_TESTS`, `GENERATED_CODE_EXTENSIONS` → `GENERATE: CODE_EXTENSIONS`, `END GENERATE` marker'lari eklendi
- `auto-format.skeleton.js`: Zaten dogru formattaydi, degisiklik gerekmedi
- 3 dosyanin section wrapper'lari tutarli hale getirildi (`// ─── GENERATE BOLUMU BASLANGIC/BITIS ───`)
<!-- SECTION:FINAL_SUMMARY:END -->
