# Eloquent (Laravel) Modul Tespiti

## Checks

- dependency: laravel/framework
- file_exists: database/migrations/
- file_exists: artisan

## Minimum Match

2/3

## Activates

- hooks/artisan-migrate-guard.js (PreToolUse Bash)
- hooks/eloquent-migration-check.js (PostToolUse Edit|Write)
- rules/eloquent-rules.skeleton.md

## Affects Core

- task-hunter: VERIFICATION_COMMANDS'a `php artisan migrate:status` eklenir
- workflow-lifecycle: Migration fail protokolu eklenir
- CLAUDE.md: Eloquent kurallari bolumu eklenir
- settings.json: 2 hook tanimi eklenir
