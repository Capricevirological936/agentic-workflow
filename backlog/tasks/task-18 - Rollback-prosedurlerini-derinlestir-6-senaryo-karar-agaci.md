---
id: TASK-18
title: Rollback prosedurlerini derinlestir (6 senaryo + karar agaci)
status: Done
assignee: []
created_date: '2026-03-22 13:36'
updated_date: '2026-03-22 14:30'
labels:
  - deploy
  - rollback
  - reliability
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem
Agentbase in workflow-lifecycle skeleton inda rollback proseduru yuzeysel. dev.aps de 6 detayli senaryo var:
- S1: Build basarisiz (eski container calisiyor)
- S2: Migration basarisiz (DB kismi degismis)
- S3: Migration basarili + uygulama basarisiz (DB ileri gitmis)
- S4: Deploy basarili + runtime hata (calisirken cokuyor)
- S5: Deploy basarili + veri silindi (DROP TABLE)
- S6: Her sey basarili + is mantigi hatali

Her senaryo icin: karar agaci, RTO hedefleri, adim adim recovery protokolu.

## Cozum
workflow-lifecycle.skeleton.md nin DEPLOY_WORKFLOW GENERATE bloguna bu 6 senaryoyu template olarak ekle. Bootstrap deploy platformuna gore (Docker/Coolify/Vercel) uygun senaryolari uretir.

## Olusturulacak
- workflow-lifecycle.skeleton.md ye detayli rollback sablonu
- Her deploy modulu icin platform-spesifik rollback adimlari (Coolify: redeploy butonu, Docker: container rollback, Vercel: instant rollback)
- RTO tablosu sablonu
- Kismi deploy kurtarma protokolu
- Veri kaybi mudahale plani sablonu
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 6 rollback senaryosu (S1-S6) workflow-lifecycle.skeleton.md ye eklendi
- [x] #2 Her senaryo icin karar agaci ve RTO hedefleri tanimlandi
- [x] #3 Platform-spesifik rollback adimlari (Coolify/Docker/Vercel) GENERATE bloklarinda
- [x] #4 Kismi deploy kurtarma protokolu sablonu eklendi
- [x] #5 Veri kaybi mudahale plani sablonu eklendi
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### workflow-lifecycle.skeleton.md — DEPLOY_WORKFLOW GENERATE blogu
Mevcut 5 satirlik sig rollback bolumu tamamen yeniden yazildi:

**6 Rollback Senaryosu (S1-S6):**
- S1: Build basarisiz — RTO 0dk, eski container calisiyor, fix-and-redeploy
- S2: Migration basarisiz — RTO 5-15dk, kismi schema geri alma, KRITIK
- S3: Migration OK + app fail — RTO 15-30dk, breaking vs additive analizi, schema+container rollback
- S4: Runtime hata — RTO 5dk, onceki deployment'a rollback + AECA root cause
- S5: Veri silindi — RTO 1-4 saat, backup restore + point-in-time recovery karar agaci
- S6: Is mantigi hatali — RTO 30-60dk, veri bozulmasi varsa rollback yoksa hotfix

**Karar Agaci:** Her senaryo icin agent davranis kurallari (KRITIK=kullaniciya bildir, YUKSEK=hizli rollback, ORTA=hotfix)

**RTO Tablosu:** 6 senaryo icin recovery time hedefleri

**Kismi Deploy Kurtarma Protokolu:** Monorepo/microservice icin servis bagimlilik analizi + API contract degisikligi kontrolu

**Veri Kaybi Mudahale Plani:** 5 adimli recovery (maintenance mode → backup kontrol → restore → migration fix → post-mortem)

**Platform-Spesifik Rollback:** ROLLBACK_PLATFORM_STEPS GENERATE blogu eklendi:
- Coolify: Dashboard/API rollback + otomatik health check rollback
- Docker: Manuel container swap
- Vercel: Instant rollback (vercel rollback CLI)
- ORM-spesifik: Prisma/TypeORM/Eloquent/Django migration rollback komutlari

### bootstrap.md
- GENERATE blok tablosuna ROLLBACK_PLATFORM_STEPS eklendi

### Test
- generate.js syntax OK, 37/37 test gecti
<!-- SECTION:FINAL_SUMMARY:END -->
