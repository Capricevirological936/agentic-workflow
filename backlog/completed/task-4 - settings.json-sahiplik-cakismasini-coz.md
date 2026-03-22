---
id: TASK-4
title: settings.json sahiplik cakismasini coz
status: Done
assignee: []
created_date: '2026-03-22 10:48'
updated_date: '2026-03-22 11:23'
labels:
  - bootstrap
  - hooks
  - architecture
dependencies:
  - TASK-6
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Teammate 3 (hook-generator) settings.json uretiyor cunku hook tanimlari orada. Teammate 4 (config-generator) de config dosyalarindan sorumlu. Ikisi de settings.json'a yazmaya kalkarsa cakisir. Cozum secenekleri: (1) settings.json tamamen Teammate 3'e ait — Teammate 4 sadece CLAUDE.md ve .mcp.json uretir, (2) settings.json Lead tarafindan teammate ciktilari birlestirilerek uretilir — teammate'ler sadece kendi hook listelerini dondurur, (3) settings.json bir skeleton'dan uretilir ve tum hook bilgisi oraya gider. Onerilen: Secenek 2 — Lead birlestirme yapar, tutarlilik saglar.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 settings.json sahipligi tek bir yere atandi (Teammate veya Lead)
- [x] #2 Bootstrap Adim 5 teammate talimatlarinda sahiplik netlestirildi
- [x] #3 Sanity check adiminda settings.json <-> .claude/hooks/ tutarlilik kontrolu eklendi
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 1 — Temel. Teammate mimarisini degistirir. TASK-6 buna bagimli.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

Secenek 2 (Lead Merge) uygulanarak settings.json sahipligi Lead'e devredildi.

### AC#1 — settings.json sahipligi tek yere atandi
- settings.json artik Lead tarafindan uretiliyor (bkz. yeni bolum 5.2.2)
- Teammate 3 ciktisindan `settings.json` kaldirildi, yerine hook dosya raporu eklendi
- Teammate 4 girdisinden `settings.skeleton.json` kaldirildi

### AC#2 — Teammate talimatlarinda sahiplik netlestirildi
- Teammate 3'e RAPOR talimati eklendi: hook dosya yollarini Lead'e listelemesi gerekiyor
- GENERATE Blok Haritasi tablosunda sahiplik `(Lead — bkz. 5.2.2)` olarak isaretlendi
- Referans sablonu `(Lead montaji — Adim 5.2.2)` olarak guncellendi
- Dosya Olusturma Raporu'na `Lead (settings.json montaji)` satiri eklendi

### AC#3 — Sanity check genisletildi
- Madde 3 genisletilerek 4 alt kontrol eklendi:
  a. Hook dosya fiziksel varlik kontrolu
  b. Orphan hook tespiti
  c. Meta-anahtar sizinti kontrolu (__doc__, __GENERATE__)
  d. JSON syntax dogrulamasi

### Ek: Bug fix
- GENERATE Blok Haritasi tablosunda eksik olan `PRETOOLUSE_EDITWRITE_HOOKS` blogu eklendi (skeleton'da mevcuttu ama tabloda yoktu)
<!-- SECTION:FINAL_SUMMARY:END -->
