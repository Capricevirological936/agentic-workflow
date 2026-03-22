# PHP Backend Ailesi Tespit Kurallari

## Checks

- file_exists: composer.json
- dependency: laravel/framework|codeigniter4/framework
- file_exists: app/|public/|routes/|spark|artisan|bootstrap/

## Minimum Match

2/3

## Variants

| Framework | Tespit Dosyasi | Oncelik |
|-----------|----------------|---------|
| Laravel | `backend/php/laravel/detect.md` | 1 |
| CodeIgniter 4 | `backend/php/codeigniter4/detect.md` | 2 |

## Activates

- rules/php-backend-rules.md

## Affects Core

- task-hunter: `composer`, `phpunit` veya framework test komutlari icin verification convention'i eklenir
- CLAUDE.md: PHP backend ortak kurallari bolumu eklenir
