# API Docs Kategori Tespiti

Bu kategori API dokumantasyon araclarini tespit eder, spec senkronizasyon kontrolleri ve dogrulama mekanizmalari saglar.

## Variants

Bootstrap asagidaki varyantlari sirayla kontrol eder. Birden fazla eslesen aktive edilebilir:

| Varyant | Tespit Dosyasi | Oncelik |
|---------|---------------|---------|
| OpenAPI/Swagger | `api-docs/openapi/detect.md` | 1 |
| GraphQL | `api-docs/graphql/detect.md` | 2 |

## Provides

- API spec dosyasi tespiti
- Endpoint degistiginde spec guncelleme hatirlatmasi
- Pre-deploy'a spec dogrulama adimi
- Code-review'a "endpoint degisti ama spec guncellenmedi" kontrolu

## Affects Core

- code-review: API spec senkronizasyonu kontrolu
- pre-deploy: Spec dogrulama
- task-review: API degisikligi checklist
- CLAUDE.md: API dokumantasyon kurallari
