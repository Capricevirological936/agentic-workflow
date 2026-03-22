# PHP Backend Ortak Kurallari

> Bu kurallar tum PHP backend leaf'leri icin gecerlidir.
> Framework-spesifik kurallar bu dosyaya EK olarak uygulanir.

## Konfigurasyon ve Secret Yonetimi

- Secret degerleri kod icine hardcode etme; framework config/env mekanizmasini kullan.
- Config okumalarini framework'un sagladigi katmanda topla; ham `$_ENV` veya `getenv()` kullanimini dagitma.
- Yeni env degerleri eklenince ornek env dosyasi da guncellenmeli.

## Ince Controller Yaklasimi

- Controller'lar request alma, validation sonucu alma ve response donme katmanidir.
- Is logigini controller'a yigmak yerine service/action katmanina tasi.
- DB sorgulari, external API cagrilari ve transaction yonetimi controller icinde daginik sekilde olmamali.

## Validation ve Response

- External input framework validation mekanizmasindan gecmeli.
- Basarili ve hatali response formatlari tutarli olmali; API varsa tekil bir response contract belirlenmeli.
- Domain hatalari ve beklenmeyen exception'lar ayri ele alinmali.

## Verification Convention

- Final kontrolde en azindan ilgili test komutu ve framework'un build/cache komut etkisi dusunulmeli.
- Cache olusturan komutlari gelistirme akisini bozmayacak sekilde kullan; gerekiyorsa clear adimi belirt.

