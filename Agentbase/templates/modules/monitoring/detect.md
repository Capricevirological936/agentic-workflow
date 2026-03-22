# Monitoring Kategori Tespiti

Bu kategori error tracking ve performance monitoring araclari icin kontrol mekanizmalari saglar.

## Variants

Bootstrap asagidaki varyantlari sirayla kontrol eder. Birden fazla eslesen aktive edilebilir:

| Varyant | Tespit Dosyasi | Oncelik |
|---------|---------------|---------|
| Sentry | `monitoring/sentry/detect.md` | 1 |
| Datadog | `monitoring/datadog/detect.md` | 2 |

## Provides

- Monitoring SDK kurulum kontrolu
- Error boundary/tracking kontrolleri
- Environment-spesifik DSN/key kontrolu
- Source map upload kontrolu (deploy sirasinda)

## Affects Core

- code-review: Error tracking checklist eklenir
- pre-deploy: Source map kontrolu eklenir
- CLAUDE.md: Monitoring kurallari bolumu eklenir
