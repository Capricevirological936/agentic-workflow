# Deploy Kategori Tespiti

Bu kategori deploy oncesi kontrol, deploy sonrasi dogrulama ve rollback rehberleri saglar.

## Variants

Bootstrap asagidaki varyantlari sirayla kontrol eder. Birden fazla eslesen aktive edilebilir:

| Varyant | Tespit Dosyasi | Oncelik |
|---------|---------------|---------|
| Docker | `deploy/docker/detect.md` | 1 |
| Coolify | `deploy/coolify/detect.md` | 2 |
| Vercel | `deploy/vercel/detect.md` | 3 |

## Provides

- Pre-deploy kontrol listesi (build, test, env senkronizasyonu)
- Post-deploy dogrulama (health check, smoke test, versiyon kontrolu)
- Rollback rehberi (platform bazli geri donus talimatlari)
- Deploy logu (tarih, commit, durum takibi)

## Affects Core

- workflow-lifecycle: Deploy akisi eklenir (pre-deploy → deploy → post-deploy)
- CLAUDE.md: Deploy kurallari bolumu eklenir
- settings.json: Deploy hook tanimlari eklenir (varsa)
