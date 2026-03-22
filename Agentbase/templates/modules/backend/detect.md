# Backend Kategori Tespiti

Bu kategori backend runtime ailelerine, framework-spesifik guard hook'larina ve kodlama kurallarina ait katkilari saglar.

## Variants

| Aile | Tespit Dosyasi | Leaf Kontrol Sirasi |
|------|----------------|---------------------|
| Node.js | `backend/nodejs/detect.md` | NestJS → Fastify → Express |
| PHP | `backend/php/detect.md` | Laravel → CodeIgniter 4 |
| Python | `backend/python/detect.md` | Django → FastAPI |

## Provides

- Aile seviyesinde ortak backend/runtime kurallari
- Framework'e ozgu tehlikeli komut korumalari
- Ortam degiskeni ve konfigurasyon yonetimi
- Test, lint, typecheck ve build convention'lari
- Guvenlik ve mimari best practice'leri

## Affects Core

- task-hunter: VERIFICATION_COMMANDS'a runtime ve framework dogrulamalari eklenir
- workflow-lifecycle: Backend hata ve rollback notlari eklenir
- CLAUDE.md: Backend aile + framework kurallari bolumu eklenir
- settings.json: Framework hook tanimlari eklenir
