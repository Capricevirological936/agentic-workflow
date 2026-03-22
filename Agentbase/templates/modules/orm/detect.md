# ORM Kategori Tespiti

Bu kategori veritabani ORM/migration araclari icin koruma mekanizmalari saglar.

## Variants

Bootstrap asagidaki varyantlari sirayla kontrol eder. Ilk eslesen aktive edilir:

| Varyant | Tespit Dosyasi | Oncelik |
|---------|---------------|---------|
| Prisma | `orm/prisma/detect.md` | 1 |
| Eloquent (Laravel) | `orm/eloquent/detect.md` | 2 |
| Django ORM | `orm/django-orm/detect.md` | 3 |
| TypeORM | `orm/typeorm/detect.md` | 4 |

## Provides

- Destructive migration tespiti (DROP TABLE/COLUMN)
- Tehlikeli komut bloklama
- Migration dosyasi tutarlilik kontrolu
- Migration risk tablosu

## Affects Core

- task-hunter: VERIFICATION_COMMANDS'a migration kontrolu eklenir
- workflow-lifecycle: Migration fail protokolu eklenir
- CLAUDE.md: ORM kurallari bolumu eklenir
- settings.json: ORM hook tanimlari eklenir
