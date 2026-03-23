# API Smoke Test

> API endpoint lerini hizlica dogrular. Post-deploy sonrasi veya bagimsiz olarak calistirilabilir.
> Kullanim: `/api-smoke`, `/api-smoke staging`, `/api-smoke https://custom-url.com`

---

## Kural: OTONOM CALIS

- Kullaniciya soru SORMA — smoke test calistir, sonuclari raporla.
- Basarisiz endpoint leri DETAYLI goster.
- Tum adimlari CALISTIR — bir adimi atlama.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.description, stack.primary, environments
Ornek cikti:
## Proje Baglami
- **Proje:** E-ticaret API
- **Stack:** Node.js + Express
- **Production:** https://api.example.com
-->

---

## ADIM 1 — Ortam Secimi

Argumani cozumle:

| Arguman | Ortam |
|---|---|
| Bos | Production (manifest environments[0]) |
| `staging` | Staging ortami |
| `https://...` | Ozel URL |

---

## ADIM 2 — Smoke Test Calistir

### 2.1 Smoke Test Endpoint Listesi

<!-- GENERATE: SMOKE_TEST_ENDPOINTS
Aciklama: Manifest ten dinamik endpoint tablosu.
Gerekli manifest alanlari: environments, api_endpoints, project.api_prefix
-->

### 2.2 Curl Script Calistir

Asagidaki script i Bash ile calistir:

```bash
<!-- GENERATE: API_SMOKE_SCRIPT
Aciklama: Manifest ten curl bazli smoke test script i.
Gerekli manifest alanlari: environments, api_endpoints, project.api_prefix
-->
```

**NOT:** Auth gerektiren endpoint ler icin `SMOKE_TEST_TOKEN` env variable set edilmeli veya script e parametre olarak verilmeli.

---

## ADIM 3 — Sonuc Raporu

```markdown
## Smoke Test Raporu

| # | Endpoint | Sonuc | Status |
|---|----------|-------|--------|
| 1 | GET /health | PASS/FAIL | 200/xxx |
| 2 | ... | ... | ... |

### Ozet
- **Toplam:** X endpoint
- **Basarili:** Y
- **Basarisiz:** Z
- **Sonuc:** PASS / FAIL

### Basarisiz Endpoint Detaylari
[Her basarisiz endpoint icin: beklenen vs gercek status, olasi neden]
```

---

## Hata Durumlari

| Durum | Aksiyon |
|---|---|
| Token yok, auth endpoint var | UYAR: "SMOKE_TEST_TOKEN set edilmeli" |
| URL erisilemez | FAIL: "Baglanti kurulamadi" |
| Timeout | FAIL: "10sn icerisinde yanit alinamadi" |
