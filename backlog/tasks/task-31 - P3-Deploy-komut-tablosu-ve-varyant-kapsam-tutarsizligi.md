---
id: TASK-31
title: 'P3: Deploy komut tablosu ve varyant kapsam tutarsizligi'
status: Done
assignee:
  - '@claude'
created_date: '2026-03-22 19:18'
updated_date: '2026-03-22 19:48'
labels:
  - readme
  - documentation
  - deploy
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Codex Bulgulari (P3)

### Bulgu 1: Deploy tablosu fazla genellestiriyor
README pre-deploy ve post-deploy i genel "Deploy" komutlari gibi sunuyor. Ama Vercel varyantinda sadece pre-deploy var, post-deploy YOK.

Duzeltme secenekleri:
a) Tabloyu varyant bazli ayir:
   - Docker: pre-deploy + post-deploy
   - Coolify: pre-deploy + post-deploy
   - Vercel: sadece pre-deploy
b) Tabloya "Varyant" sutunu ekle ve hangisinde hangi komut var goster
c) Dipnot ekle: "Her deploy varyanti tum komutlari icermeyebilir"

### Bulgu 2: Vercel post-deploy eksik
Vercel icin post-deploy skeleton i yok. Ya olusturulmali ya da README den Vercel in sadece pre-deploy destekledigi belirtilmeli.

## Etkilenen Dosyalar
- README.md (deploy komut tablosu)
- Opsiyonel: templates/modules/deploy/vercel/commands/post-deploy.skeleton.md (olusturulabilir)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Deploy komut tablosu varyant bazli hangi komutun mevcut oldugunu dogru gosteriyor
- [x] #2 Vercel icin post-deploy durumu netlestirildi (ya skeleton eklendi ya da README de belirtildi)
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Deploy komut tablosuna Varyantlar sutunu eklendi. pre-deploy (Docker, Coolify, Vercel), post-deploy (Docker, Coolify — Vercel serverless yapisi nedeniyle desteklenmiyor). Vercel post-deploy durumu tabloda acikca belirtildi; gereksiz skeleton olusturulmadi.
<!-- SECTION:FINAL_SUMMARY:END -->
