# Django Modul Tespit Kurallari

## Checks

- dependency: django|Django
- file_exists: manage.py
- file_exists: settings.py|settings/

## Minimum Match

2/3

## Activates

- hooks/django-guard.js (PreToolUse Bash)
- rules/django-rules.skeleton.md

## Affects Core

- task-hunter: VERIFICATION_COMMANDS'a `python manage.py test` eklenir
- workflow-lifecycle: Django komut korumalari eklenir
- CLAUDE.md: Django kodlama kurallari bolumu eklenir
- settings.json: 1 hook tanimi eklenir
