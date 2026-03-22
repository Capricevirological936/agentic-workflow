# Django ORM Modul Tespiti

## Checks

- dependency: django | Django
- file_exists: manage.py
- file_pattern: */migrations/

## Minimum Match

2/3

## Activates

- hooks/manage-py-guard.js (PreToolUse Bash)
- rules/django-orm-rules.skeleton.md

## Affects Core

- task-hunter: VERIFICATION_COMMANDS'a `python manage.py showmigrations` eklenir
- workflow-lifecycle: Migration fail protokolu eklenir
- CLAUDE.md: Django ORM kurallari bolumu eklenir
- settings.json: 1 hook tanimi eklenir
