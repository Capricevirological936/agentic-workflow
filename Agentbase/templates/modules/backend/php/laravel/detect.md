# Laravel Modul Tespit Kurallari

## Checks

- dependency: laravel/framework
- file_exists: artisan
- file_exists: app/Http/Controllers/

## Minimum Match

2/3

## Activates

- hooks/artisan-guard.js (PreToolUse Bash)
- rules/laravel-rules.skeleton.md

## Affects Core

- task-hunter: VERIFICATION_COMMANDS'a `php artisan test` eklenir
- workflow-lifecycle: Artisan komut korumalari eklenir
- CLAUDE.md: Laravel kodlama kurallari bolumu eklenir
- settings.json: 1 hook tanimi eklenir
