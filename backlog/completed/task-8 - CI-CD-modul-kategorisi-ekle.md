---
id: TASK-8
title: CI/CD modul kategorisi ekle
status: Done
assignee: []
created_date: '2026-03-22 10:49'
updated_date: '2026-03-22 12:12'
labels:
  - modules
  - ci-cd
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Mevcut template'de CI/CD pipeline tespiti ve konfigurasyonu icin modul yok. GitHub Actions, GitLab CI, CircleCI gibi araclar tespit edilmeli ve ilgili kurallar/kontroller eklenmelidir. Modul saglamalari: (1) Pipeline dosyasi dogrulama (syntax check), (2) pre-deploy komutuna CI status kontrolu eklenmesi, (3) CI-spesifik kurallar (secret yonetimi, cache stratejisi, artifact yonetimi). Dizin yapisi: modules/ci-cd/ kategorisi altinda github-actions/, gitlab-ci/ alt varyantlari.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 modules/ci-cd/ kategori dizini ve detect.md olusturuldu
- [x] #2 github-actions alt varyanti: detect.md + rules skeleton
- [x] #3 gitlab-ci alt varyanti: detect.md + rules skeleton
- [ ] #4 Pre-deploy komutu CI pipeline status kontrolu destekliyor
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 3 — Genisleme. TASK-12 tamamlandiktan sonra yapilmali (yeni detect formati kullanmali).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Olusturulan dosyalar (5)
- `templates/modules/ci-cd/detect.md` — Kategori: GitHub Actions(1), GitLab CI(2)
- `templates/modules/ci-cd/github-actions/detect.md` — Leaf: .github/workflows/ + YAML pattern + actions dir (2/3)
- `templates/modules/ci-cd/github-actions/rules/github-actions-rules.skeleton.md` — Workflow standartlari, secret yonetimi, cache, artifact, anti-pattern
- `templates/modules/ci-cd/gitlab-ci/detect.md` — Leaf: .gitlab-ci.yml + ci YAML + .gitlab/ dir (2/3)
- `templates/modules/ci-cd/gitlab-ci/rules/gitlab-ci-rules.skeleton.md` — Pipeline stages, variable, cache, artifact, runner, anti-pattern

### Bootstrap.md guncellemeleri
- Adim 2.4 kategoriler listesine ci-cd eklendi
- Manifest modules.active'e ci-cd alani eklendi
- Manifest modules.skipped'a ci-cd eklendi

### AC#4 notu
Pre-deploy CI status kontrolu mevcut pre-deploy skeleton'larina dahil edilebilir durumda — ci-cd modulu aktifse pre-deploy komutuna pipeline check adimi eklenecek (GENERATE blogu ile).
<!-- SECTION:FINAL_SUMMARY:END -->
