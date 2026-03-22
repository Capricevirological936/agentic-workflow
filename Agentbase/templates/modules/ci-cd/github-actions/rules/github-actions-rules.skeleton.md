# GitHub Actions Kurallari

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
-->

## Temel Kurallar

### Workflow Dosyasi Standartlari
- Her workflow dosyasinda `name:` alani zorunludur
- Workflow trigger'lari acikca belirtilmeli (`on:` blogu)
- `runs-on:` her job'da tanimli olmali

### Secret Yonetimi

| Kural | Aciklama |
|-------|----------|
| Hardcoded secret YASAK | Tum secret'lar GitHub Secrets uzerinden yonetilmeli |
| Environment secret'lari | Production secret'lari environment protection ile korunmali |
| GITHUB_TOKEN scope | Minimum gerekli izinler verilmeli (`permissions:` blogu) |

### Cache Stratejisi
- Node.js projeleri: `actions/cache` ile `node_modules/` veya `.npm/` cache'lenmeli
- Python projeleri: `pip` cache kullanilmali
- Docker build: layer cache (`docker/build-push-action` ile `cache-from/cache-to`)

### Artifact Yonetimi
- Build artifact'lari `actions/upload-artifact` ile saklanmali
- Test raporlari (coverage, junit) artifact olarak yuklenmeli
- Artifact retention suresi proje ihtiyacina gore ayarlanmali (default 90 gun)

### Anti-Pattern'ler

| Anti-Pattern | Dogru Yaklasim |
|-------------|----------------|
| `continue-on-error: true` gereksiz kullanimi | Sadece opsiyonel adimlar icin kullanin |
| Butun repoyu checkout (`fetch-depth: 0`) | Gereksizse shallow clone (`fetch-depth: 1`) |
| `latest` tag kullanimi action'larda | Spesifik versiyon pin'leyin (`@v4`, `@sha`) |
| Tek monolitik workflow | Ise gore ayrilmis workflow'lar (test, build, deploy) |
