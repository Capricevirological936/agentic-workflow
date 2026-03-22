# Python Backend Ortak Kurallari

> Bu kurallar tum Python backend leaf'leri icin gecerlidir.
> Framework-spesifik kurallar bu dosyaya EK olarak uygulanir.

## Ortam ve Bagimlilik Yonetimi

- Sanal ortam/packaging stratejisi (`venv`, Poetry, uv, pip-tools) ekipte tek bir standarda baglanmali.
- Bagimliliklar uygulama kodundan degil dependency manifest'inden yonetilmeli.
- Yeni runtime bagimliligini eklerken versiyon ve uyumluluk etkisini not et.

## Konfigurasyon ve Secret Yonetimi

- Secret degerleri kod icine hardcode etme.
- Ayarlar merkezi bir settings/config katmaninda toplanmali.
- Ortam bazli davranis farklari (`local`, `test`, `production`) acik ve test edilebilir olmali.

## Tipler ve Yapi

- Yeni backend kodunda tip ipuclari kullan; public fonksiyonlar ve servis sinirlari ozellikle tiplenmeli.
- Route/view katmani ile domain/is logigi birbirinden ayrilmali.
- Uzun fonksiyonlar yerine okunabilir, testlenebilir servis/parca tasarimi tercih et.

## Verification Convention

- Final dogrulamada en azindan test ve lint/format adimlari dusunulmeli; ekip kullaniyorsa type check de eklenmeli.
- Async ve sync kodun karistigi durumlarda event loop veya bloklayici I/O riskleri ayrica gozden gecirilmeli.

