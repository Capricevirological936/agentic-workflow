# CI/CD Kategori Tespiti

Bu kategori CI/CD pipeline araclarini tespit eder, pipeline dogrulama kurallari ve kontrolleri saglar.

## Variants

Bootstrap asagidaki varyantlari sirayla kontrol eder. Birden fazla eslesen aktive edilebilir:

| Varyant | Tespit Dosyasi | Oncelik |
|---------|---------------|---------|
| GitHub Actions | `ci-cd/github-actions/detect.md` | 1 |
| GitLab CI | `ci-cd/gitlab-ci/detect.md` | 2 |

## Provides

- Pipeline dosyasi dogrulama (syntax check)
- Pre-deploy CI status kontrolu
- CI-spesifik kurallar (secret yonetimi, cache stratejisi, artifact yonetimi)

## Affects Core

- workflow-lifecycle: CI pipeline entegrasyonu
- CLAUDE.md: CI kurallari
- pre-deploy: Pipeline status kontrolu
