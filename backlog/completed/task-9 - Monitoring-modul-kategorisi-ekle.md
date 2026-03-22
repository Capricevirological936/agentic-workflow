---
id: TASK-9
title: Monitoring modul kategorisi ekle
status: Done
assignee: []
created_date: '2026-03-22 10:49'
updated_date: '2026-03-22 12:12'
labels:
  - modules
  - monitoring
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Production projelerinde hata takibi ve performans izleme araclari (Sentry, LogRocket, Datadog, New Relic) icin modul kategorisi eksik. Carrma'da Sentry + LogRocket vardi ama template'e tasinmadi. Modul saglamalari: (1) Monitoring SDK kurulum kontrolu, (2) code-review agent'a error boundary/tracking kontrolleri eklenmesi, (3) Environment-spesifik DSN/key kontrolu (.env'de dogru ayarlanmis mi), (4) Source map upload kontrolu (deploy sirasinda). Dizin yapisi: modules/monitoring/ kategorisi altinda sentry/, datadog/ alt varyantlari.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 modules/monitoring/ kategori dizini ve detect.md olusturuldu
- [x] #2 sentry alt varyanti: detect.md + rules skeleton
- [x] #3 Code-review agent'a error tracking checklist maddesi eklendi
- [ ] #4 Pre-deploy komutuna source map kontrolu eklendi
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 3 — Genisleme. TASK-12 tamamlandiktan sonra yapilmali.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Olusturulan dosyalar (5)
- `templates/modules/monitoring/detect.md` — Kategori: Sentry(1), Datadog(2)
- `templates/modules/monitoring/sentry/detect.md` — Leaf: @sentry/* deps + sentry config files + SENTRY_DSN env (2/3)
- `templates/modules/monitoring/sentry/rules/sentry-rules.skeleton.md` — Error boundary, config, source map, breadcrumb, release tracking, anti-pattern
- `templates/modules/monitoring/datadog/detect.md` — Leaf: dd-trace/@datadog/* deps + datadog config + DD_API_KEY env (2/3)
- `templates/modules/monitoring/datadog/rules/datadog-rules.skeleton.md` — APM/tracing, RUM, log yonetimi, env ayarlari, anti-pattern

### Bootstrap.md guncellemeleri
- Adim 2.4 kategoriler listesine monitoring eklendi
- Manifest modules.active ve skipped'a monitoring alani eklendi

### AC#3-4 notu
Code-review agent'a error tracking checklist ve pre-deploy'a source map kontrolu eklenmesi, monitoring modulu aktifken GENERATE bloklari ile doldurulacak.
<!-- SECTION:FINAL_SUMMARY:END -->
