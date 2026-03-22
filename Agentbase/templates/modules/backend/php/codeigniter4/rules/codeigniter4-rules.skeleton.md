# CodeIgniter 4 Kodlama Kurallari

> Bu kurallar CodeIgniter 4 kullanan projeler icin gecerlidir.
> `backend/php` aile kurallari bu dosyayla birlikte uygulanir.

## Konfigurasyon ve Ortam

- Environment ayarlari `.env` ve `app/Config/*` uzerinden yonetilmeli.
- Secret degerleri `Config` veya env katmani disinda hardcode etme.
- Framework davranisini degistiren config override'lari acik ve izlenebilir olmali.

## Controller, Validation ve Service Ayrimi

- Controller'lar request/response odakli ince katman olarak kalmali.
- Validation `Validation` servisi veya request seviyesinde acikca tanimlanmali.
- Is logigini controller veya model icinde buyutmek yerine service/library siniflarina tasi.

## Filter ve Yetkilendirme

- Auth, rate-limit, CORS veya benzeri cross-cutting davranislar filter katmaninda tanimlanmali.
- Endpoint korumasini controller ici `if` bloklarina dagitma.

## Model ve Response Deseni

- Model'ler veri erisim ve persistence katmanina odaklanmali.
- API endpoint'lerinde response sekli tutarli olmali; hata cevaplari tek bir kontrata baglanmali.
- Entity veya raw array kullanimi ekip standardina gore net olmali; iki yaklasimi ayni feature icinde karistirma.

