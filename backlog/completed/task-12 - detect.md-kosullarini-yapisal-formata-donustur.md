---
id: TASK-12
title: detect.md kosullarini yapisal formata donustur
status: Done
assignee: []
created_date: '2026-03-22 10:50'
updated_date: '2026-03-22 11:39'
labels:
  - bootstrap
  - reliability
  - modules
dependencies:
  - TASK-7
  - TASK-8
  - TASK-9
  - TASK-10
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Mevcut detect.md dosyalari dogal dil ile yazilmis kosullar iceriyor: '- [ ] package.json da express dependency si var'. Bu Claude'un yorumlamasina bagli — yanlis pozitif/negatif riski var. Cozum: detect.md icinde yapisal bir format tanimla ki Bootstrap daha guvenilir tespit yapsin. Ornek format: '## Checks\n- file_exists: prisma/schema.prisma\n- dependency: @prisma/client\n- env_var: DATABASE_URL\n## Minimum Match: 2/3'. Bu format hem Claude tarafindan okunabilir hem de ileride generate.js script'i tarafindan programatik olarak islenebilir. Tum detect.md dosyalari bu formata migre edilmeli.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 detect.md yapisal format tanimlandi ve dokumante edildi
- [x] #2 Tum kategori detect.md dosyalari (7 adet) yeni formata migre edildi
- [x] #3 Tum alt varyant detect.md dosyalari (~20 adet) yeni formata migre edildi
- [x] #4 Bootstrap Adim 2.4 yeni formati destekliyor
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 2 — Guvenilirlik. TASK-3 tamamlandiktan sonra yapilmali. TASK-7 ve yeni moduller (8,9,10) buna bagimli.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### AC#1 — Yapisal format tanimlandi ve dokumante edildi
- Bootstrap Adim 2.4'e "detect.md Yapisal Formati" alt bolumu eklendi
- 7 check tipi tanimlandi: file_exists, dependency, env_var, file_pattern, code_pattern, config_key, not_dependency
- Leaf/standalone, category ve family dosya tipleri icin ayri format sablonlari eklendi
- Minimum Match formati (X/Y) ve `|` alternatif sozdizimi dokumante edildi

### AC#2 — Kategori detect.md dosyalari (7 adet) migre edildi
- orm, deploy, frontend, mobile, backend (5 kategori) → Variants tablosu + Provides + Affects Core
- monorepo, security (2 standalone) → Checks + Minimum Match + Activates + Affects Core

### AC#3 — Alt varyant detect.md dosyalari (~23 adet) migre edildi
- 3 aile/intermediate (nodejs, php, python) → Checks + Variants + Activates + Affects Core
- 1 fallback (html) → Checks + Activates
- 19 leaf (express, nestjs, fastify, laravel, codeigniter4, django, fastapi, prisma, eloquent, django-orm, typeorm, docker, coolify, vercel, nextjs, react, expo, react-native, flutter) → Checks + Minimum Match + Activates + Affects Core

### AC#4 — Bootstrap Adim 2.4 yeni formati destekliyor
- Tespit akisi pseudocode'u "Checks bolumunu isle" ve "Variants tablosundaki oncelik sirasina gore" referanslariyla guncellendi
- Check tip tablosu ve ornek format sablonlari eklendi

### Dogrulama
- 25 dosyada `## Checks` bolumu mevcut
- 8 dosyada `## Variants` bolumu mevcut
- 0 dosyada eski `- [ ]` formati kaldi
- Toplam: 30 detect.md dosyasinin tamami migre edildi
<!-- SECTION:FINAL_SUMMARY:END -->
