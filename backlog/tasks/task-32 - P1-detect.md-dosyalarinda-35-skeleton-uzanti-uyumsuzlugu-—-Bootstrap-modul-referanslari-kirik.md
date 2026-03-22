---
id: TASK-32
title: >-
  P1: detect.md dosyalarinda 35 skeleton uzanti uyumsuzlugu — Bootstrap modul
  referanslari kirik
status: Done
assignee:
  - '@claude'
created_date: '2026-03-22 19:23'
updated_date: '2026-03-22 19:32'
labels:
  - bug
  - templates
  - detect
  - critical
  - consistency
dependencies: []
references:
  - Agentbase/templates/modules/ (tum detect.md dosyalari)
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem

Tum detect.md dosyalari, aktive ettikleri dosyalari `.skeleton` uzantisi OLMADAN referans veriyor. Ancak gercek dosyalar `.skeleton.*` uzantisiyla mevcut.

**Ornek:**
- detect.md diyor: `rules/express-rules.md`
- Gercek dosya: `rules/express-rules.skeleton.md`

Bu sistematik uyumsuzluk Bootstrap'in modul analizi sirasinda yanlis dosya referanslarina yol aciyor.

## Etki Alani — 35 Dosya

**Rules referanslari (26 adet):**
- `modules/frontend/html/detect.md` → `rules/html-rules.md` (gercek: `.skeleton.md`)
- `modules/backend/nodejs/express/detect.md` → `rules/express-rules.md`
- `modules/backend/nodejs/nestjs/detect.md` → `rules/nestjs-rules.md`
- `modules/backend/nodejs/fastify/detect.md` → `rules/fastify-rules.md`
- `modules/backend/python/django/detect.md` → `rules/django-rules.md`
- `modules/backend/python/fastapi/detect.md` → `rules/fastapi-rules.md`
- `modules/backend/python/detect.md` → `rules/python-backend-rules.md`
- `modules/backend/php/detect.md` → `rules/php-backend-rules.md`
- `modules/backend/php/laravel/detect.md` → `rules/laravel-rules.md`
- `modules/backend/php/codeigniter4/detect.md` → `rules/codeigniter4-rules.md`
- `modules/mobile/react-native/detect.md` → `rules/react-native-rules.md`
- `modules/mobile/expo/detect.md` → `rules/design-system.md`
- `modules/mobile/flutter/detect.md` → `rules/flutter-rules.md`
- `modules/orm/prisma/detect.md` → `rules/prisma-rules.md`
- `modules/orm/eloquent/detect.md` → `rules/eloquent-rules.md`
- `modules/orm/django-orm/detect.md` → `rules/django-orm-rules.md`
- `modules/orm/typeorm/detect.md` → `rules/typeorm-rules.md`
- `modules/monitoring/datadog/detect.md` → `rules/datadog-rules.md`
- `modules/monitoring/sentry/detect.md` → `rules/sentry-rules.md`
- `modules/ci-cd/gitlab-ci/detect.md` → `rules/gitlab-ci-rules.md`
- `modules/ci-cd/github-actions/detect.md` → `rules/github-actions-rules.md`
- `modules/api-docs/openapi/detect.md` → `rules/openapi-rules.md`
- `modules/api-docs/graphql/detect.md` → `rules/graphql-rules.md`
- + frontend/nextjs, frontend/react, backend/nodejs detect.md dosyalari

**Commands referanslari (6 adet):**
- `modules/monorepo/detect.md` → `commands/review-module.md` (gercek: `.skeleton.md`)
- `modules/security/detect.md` → `commands/idor-scan.md`
- `modules/deploy/docker/detect.md` → `commands/pre-deploy.md`, `commands/post-deploy.md`
- `modules/deploy/vercel/detect.md` → `commands/pre-deploy.md`
- `modules/deploy/coolify/detect.md` → `commands/post-deploy.md`

**Hooks referanslari (2 adet):**
- `modules/monorepo/detect.md` → `hooks/auto-format.js` (gercek: `.skeleton.js`)
- `modules/api-docs/openapi/detect.md` → `hooks/openapi-sync-check.js`

**Agents referanslari (1 adet):**
- `modules/deploy/docker/detect.md` → `agents/devops.md` (gercek: `.skeleton.md`)

## Root Cause

`.skeleton.*` uzanti convention'i detect.md dosyalari yazildiktan SONRA eklenmis. Referanslar guncellenmemis.

## Cozum

Tum detect.md dosyalarindaki `Activates:` bolumlerinde referanslari `.skeleton.*` uzantisiyla guncelle. Toplam 35 dosyada ~40 referans degisecek.

## Etkilenen Dizin
- `Agentbase/templates/modules/` altindaki tum detect.md dosyalari
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Tum detect.md dosyalarindaki dosya referanslari gercek dosya adlariyla (.skeleton.*) eslesiyor
- [x] #2 Hicbir detect.md de skeleton uzantisi olmayan dosya referansi kalmadi
- [x] #3 grep -r 'rules/' templates/modules/*/detect.md komutuyla dogrulama yapildi — tum referanslar .skeleton iceriyor
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Tüm detect.md dosyalarını bul ve oku\n2. Her dosyadaki Activates bölümünde .skeleton uzantısı eksik referansları tespit et\n3. Bulk edit ile tüm referansları düzelt\n4. grep ile doğrulama yap
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
28 detect.md dosyasinda toplam 34 referans duzeltildi:\n- 26 rules referansi: `.md` → `.skeleton.md`\n- 6 commands referansi: `.md` → `.skeleton.md`\n- 2 hooks referansi: `.js` → `.skeleton.js`\n- 1 agents referansi: `.md` → `.skeleton.md`\n\nCoolify detect.md zaten dogru formattaydi (degisiklik gerekmedi).\nORM ve backend hook referanslari (prisma, eloquent, django-orm, typeorm, laravel, codeigniter4, django) `.js` olarak dogru — bu dosyalar skeleton degil.\n\nDogrulama: grep ile skeleton uzantisi olmayan referans 0, skeleton referans sayisi 37/31 dosya.
<!-- SECTION:FINAL_SUMMARY:END -->
