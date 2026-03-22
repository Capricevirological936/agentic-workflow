# GitLab CI Kurallari

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
-->

## Temel Kurallar

### Pipeline Stage Standartlari
- Her pipeline'da standart stage sirasi tanimlanmali: `stages: [build, test, deploy]`
- Her job mutlaka bir `stage:` alani icermeli
- Stage isimleri kucuk harf ve tire ile yazilmali (ornek: `integration-test`)
- Gereksiz stage tanimlamasindan kacinilmali — kullanilmayan stage pipeline'i yavaslatir

### Variable Yonetimi

| Kural | Aciklama |
|-------|----------|
| Hardcoded secret YASAK | Tum secret'lar CI/CD Variables uzerinden yonetilmeli |
| Protected variable'lar | Production secret'lari `protected` olarak isaretlenmeli |
| Masked variable'lar | Hassas degerler `masked` olarak isaretlenmeli |
| `$CI_*` degiskenleri | GitLab'in yerlesik degiskenlerini kullanin (`$CI_COMMIT_SHA`, `$CI_PIPELINE_ID` vb.) |
| Group-level variable'lar | Ortak secret'lar group seviyesinde tanimlanmali |

### Cache Stratejisi
- Cache key olarak `$CI_COMMIT_REF_SLUG` veya lock dosyasi hash'i kullanilmali
- Node.js projeleri: `node_modules/` veya `.npm/` cache'lenmeli
- Python projeleri: `.pip/` veya `venv/` cache'lenmeli
- Cache policy: sadece okuyan job'larda `policy: pull`, yazan job'larda `policy: push`
- Fallback key tanimlanmali (`cache:key:files` veya `cache:key:prefix`)

### Artifact Yonetimi
- Build artifact'lari `artifacts:paths` ile tanimlanmali
- Test raporlari `artifacts:reports` ile (junit, coverage, sast vb.) yuklenmeli
- Artifact suresi `expire_in` ile sinirlanmali (ornek: `expire_in: 7 days`)
- Gereksiz buyuk dosyalar artifact olarak saklanmamali
- `dependencies` veya `needs` ile hangi job'larin artifact'lari alacagi acikca belirtilmeli

### Runner Secimi

| Kural | Aciklama |
|-------|----------|
| `tags` kullanimi | Her job icin uygun runner tag'i belirtilmeli |
| Shared runner | Genel amacli isler icin shared runner tercih edilmeli |
| Specific runner | Ozel gereksinimler icin (GPU, ozel network) specific runner kullanilmali |
| Docker executor | Image versiyonu sabitlenmeli (`image: node:20-alpine`, `latest` degil) |

### Anti-Pattern'ler

| Anti-Pattern | Dogru Yaklasim |
|-------------|----------------|
| `allow_failure: true` gereksiz kullanimi | Sadece gercekten opsiyonel adimlar icin kullanin |
| Gereksiz `dependencies` | `needs` ile sadece gerekli job'lara baglanti kurun |
| Butun repo'yu cache'lemek | Sadece bagimlilik klasorlerini cache'leyin |
| `when: manual` kotu kullanimi | Production deploy haricinde manual gate koymaktan kacinin |
| `image: latest` kullanimi | Spesifik versiyon pin'leyin (`image: node:20.11-alpine`) |
| Tek monolitik `.gitlab-ci.yml` | `include` ile parcalanmis konfigrasyon dosyalari kullanin |
| `only/except` kullanimi | Modern `rules:` syntax'ini tercih edin |
