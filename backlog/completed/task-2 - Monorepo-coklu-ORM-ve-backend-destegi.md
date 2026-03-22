---
id: TASK-2
title: Monorepo coklu ORM ve backend destegi
status: Done
assignee: []
created_date: '2026-03-22 10:47'
updated_date: '2026-03-22 11:30'
labels:
  - bootstrap
  - monorepo
  - architecture
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Monorepo projelerinde farkli subproject'ler farkli stack kullanabilir. Ornegin api/ Express + Prisma, admin/ Django + Django ORM, mobile/ Expo. Mevcut modul tespiti kategoride tek bir leaf secer — digerleri atlanir. Cozum: manifest.modules yapisini subproject-bazli genislet. Her subproject kendi aktif modullerini tasir. Bootstrap roportajinda monorepo tespit edildiginde her subproject icin ayri modul tespiti yapilmali. Teammate'ler dosya uretirken subproject-scope'lu GENERATE bloklari doldurmali.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Manifest yapisi subproject-bazli modul destegi iceriyor
- [x] #2 Bootstrap modul tespiti her subproject icin ayri calisiyor
- [x] #3 GENERATE bloklari subproject scope'unu destekliyor (ornek: VERIFICATION_COMMANDS her subproject icin ayri)
- [x] #4 Ornek senaryo: Express+Prisma api/ ve Django admin/ monorepo basariyla yapilandiriliyor
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 1 — Temel. Manifest yapisini degistirir. Tum GENERATE bloklarini etkiler.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

Tum degisiklikler `bootstrap.md` dosyasinda.

### AC#1 — Manifest yapisi subproject-bazli modul destegi
- `project.subprojects[]` yapisina `modules` alani eklendi (orm, backend, frontend, mobile)
- Her subproject kendi aktif modullerini tasir
- `modules.active` monorepo'larda leaf listesi destekliyor (ornegin `orm: ["prisma", "django-orm"]`)
- Global `modules.active` tum subproject modullerinin UNION'i olarak tanimlandi

### AC#2 — Modul tespiti subproject-bazli calisiyor
- Adim 2.4'e monorepo iki asamali tespit mantigi eklendi:
  1. Subproject-bazli tespit: Her subproject icin ayri modul detection loop'u
  2. Global aggregation: Tum subproject modullerinin union'i modules.active'e yazilir
- Deploy ve standalone moduller proje genelinde tespit edilmeye devam ediyor
- Ornek cikti sablonu eklendi (apps/api, apps/admin, apps/mobile)

### AC#3 — GENERATE bloklari subproject scope destegi
- Teammate prompt sablonundaki Kurallar bolumune (kural 7) monorepo GENERATE scope talimati eklendi
- VERIFICATION_COMMANDS, TEST_COMMANDS, COMPILE_COMMANDS → subproject bazli satir
- IMPLEMENTATION_RULES, REVIEW_CHECKLIST → subproject modullere gore kurallar
- CODEBASE_CONTEXT → tum subproject'ler ve stack'leri
- Teammate 2'ye monorepo davranisi notu eklendi (tum active leaf'lerin dosyalarini uret)

### AC#4 — Ornek senaryo
- Express+Prisma API + Django Admin + Expo Mobile monorepo manifest ornegi eklendi
- 3 subproject (api, admin, mobile) her biri farkli stack ve modullerle
- Global modules.active aggregation ornegi
<!-- SECTION:FINAL_SUMMARY:END -->
