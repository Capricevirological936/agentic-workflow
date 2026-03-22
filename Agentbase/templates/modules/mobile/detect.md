# Mobile Kategori Tespiti

Bu kategori mobil uygulama gelistirme icin tasarim sistemi kurallari ve platform-spesifik kontroller saglar.

## Variants

| Varyant | Tespit Dosyasi | Oncelik | Not |
|---------|---------------|---------|-----|
| Expo | `mobile/expo/detect.md` | 1 | Expo tespit edilirse plain RN aktive edilmez |
| React Native (plain) | `mobile/react-native/detect.md` | 2 | Sadece Expo kullanilmayan RN projeleri |
| Flutter | `mobile/flutter/detect.md` | 3 | Farkli teknoloji stack'i, diger modullerle catismaz |

## Provides

- Tasarim sistemi kural dosyasi (renk, tipografi, bilesenler)
- Code review agent'a tema/stil kontrolu eklenir
- Platform-spesifik kurallar (iOS/Android farkliliklari)

## Affects Core

- code-review: tema/renk kullanim kontrolu
- task-hunter: IMPLEMENTATION_RULES'a RN pattern'leri eklenir
- settings.json: ilgili plugin'ler aktive edilir
