---
id: TASK-10
title: API docs modul kategorisi ekle
status: Done
assignee: []
created_date: '2026-03-22 10:49'
updated_date: '2026-03-22 12:12'
labels:
  - modules
  - api-docs
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
API projelerinde OpenAPI/Swagger spec senkronizasyonu kontrolu eksik. Carrma'da openapi:validate hook'u vardi ama template'e tasinmadi. Modul saglamalari: (1) OpenAPI/Swagger dosyasi tespiti, (2) API endpoint degistiginde spec guncelleme hatirlatmasi (PostToolUse hook), (3) pre-deploy'a spec dogrulama adimi eklenmesi, (4) code-review agent'a 'API endpoint degisti ama spec guncellenmedi' kontrolu. Dizin yapisi: modules/api-docs/ kategorisi altinda openapi/, graphql/ alt varyantlari.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 modules/api-docs/ kategori dizini ve detect.md olusturuldu
- [x] #2 openapi alt varyanti: detect.md + hooks + rules
- [x] #3 PostToolUse hook: route dosyasi degistiginde spec hatirlatmasi
- [x] #4 Pre-deploy adimina spec dogrulama eklendi
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 3 — Genisleme. TASK-12 tamamlandiktan sonra yapilmali.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Olusturulan dosyalar (6)
- `templates/modules/api-docs/detect.md` — Kategori: OpenAPI(1), GraphQL(2)
- `templates/modules/api-docs/openapi/detect.md` — Leaf: spec dosyalari + swagger deps + api-docs pattern (2/3)
- `templates/modules/api-docs/openapi/hooks/openapi-sync-check.skeleton.js` — PostToolUse hook: route degistiginde spec guncelleme hatirlatmasi. GENERATE: ROUTE_PATTERNS ve SPEC_PATHS bloklari mevcut.
- `templates/modules/api-docs/openapi/rules/openapi-rules.skeleton.md` — Spec standartlari, endpoint dokumantasyonu, senkronizasyon kurallari, dogrulama, anti-pattern
- `templates/modules/api-docs/graphql/detect.md` — Leaf: schema.graphql + graphql deps + resolver pattern (2/3)
- `templates/modules/api-docs/graphql/rules/graphql-rules.skeleton.md` — Schema standartlari, resolver kurallari (N+1, auth), type safety, anti-pattern

### Bootstrap.md guncellemeleri
- Adim 2.4 kategoriler listesine api-docs eklendi
- Manifest modules.active ve skipped'a api-docs alani eklendi
<!-- SECTION:FINAL_SUMMARY:END -->
