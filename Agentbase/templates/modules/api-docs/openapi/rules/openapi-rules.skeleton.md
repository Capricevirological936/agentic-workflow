# OpenAPI Kurallari

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
-->

---

## Spec Dosyasi Standartlari

- OpenAPI 3.0+ kullanimi **zorunludur**. Swagger 2.0 yeni projelerde kabul edilmez.
- Spec dosyasinda asagidaki alanlar **zorunlu** olmalidir:
  - `info.title` — API'nin adi
  - `info.version` — Semantik versiyon (ornegin `1.2.0`)
  - `info.description` — API'nin kisa aciklamasi
- `servers` alani en az bir ortam (development, staging, production) icermelidir.

---

## Endpoint Dokumantasyonu

Her endpoint (`paths` altindaki her operasyon) icin asagidakiler **zorunludur**:

| Alan | Aciklama |
|------|----------|
| `summary` | Endpoint'in tek satirlik aciklamasi |
| `description` | Detayli kullanim bilgisi |
| `requestBody.content.schema` | Request body olan endpoint'lerde zorunlu |
| `responses.2xx.content.schema` | Basarili response'un schema tanimi |
| `responses.4xx` | En az bir hata response'u (400, 401, 404 vb.) |
| `responses.5xx` | Sunucu hatasi response tanimi |
| `tags` | Gruplandirma icin en az bir tag |

---

## Senkronizasyon Kurallari

1. **Route degistiginde spec guncellenmeli.** Bir endpoint'in path'i, method'u, request/response yapisi degistiginde ilgili spec dosyasi ayni commit'te guncellenmelidir.
2. **Yeni endpoint eklendiginde spec'e eklenmeli.** Yeni bir route tanimlandiysa, spec dosyasina karsilik gelen operasyon tanimlanmalidir.
3. **Endpoint kaldirildiginda spec'ten cikarilmali.** Silinen veya devre disi birakilan endpoint'ler spec'ten kaldirilmali ya da `deprecated: true` ile isaretlenmelidir.
4. **Schema degisiklikleri yansitilmali.** Model/DTO degisiklikleri `components/schemas` altinda guncellenmeli.

---

## Dogrulama

- Pre-deploy asamasinda spec validation **calistirilmalidir** (ornegin `npx @redocly/cli lint openapi.yaml`).
- Schema `$ref` referanslari gecerli olmalidir — kirik referans deploy'u engelleyici hata olarak degerlendirilir.
- CI pipeline'da spec dogrulama adimi eklenmesi **onerilir**.

---

## Anti-Pattern'ler

| Anti-Pattern | Dogru Yaklasim |
|-------------|----------------|
| Hardcoded ornek degerler (`example: "john"`) yerine schema kullanmamak | `schema` ile tip tanimlayin, `example` opsiyonel olarak ekleyin |
| Eksik error response tanimlari | Her endpoint'te en az `400`, `401`, `500` response tanimlayin |
| Deprecated endpoint'lerin spec'te isaretlenmemesi | `deprecated: true` ekleyin ve `description`'da alternatif endpoint'i belirtin |
| Tum schema'larin inline tanimlanmasi | `components/schemas` altinda tanimlayin, `$ref` ile referans verin |
| Spec dosyasinin version'inin guncellenmemesi | API degisikliklerinde `info.version`'i semantik versiyonlamaya uygun artirin |
| Farkli ortamlar icin ayri spec dosyasi tutmak | Tek spec + `servers` alani ile ortamlari tanimlyin |
