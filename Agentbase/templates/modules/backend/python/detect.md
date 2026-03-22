# Python Backend Ailesi Tespit Kurallari

## Checks

- file_exists: requirements.txt|pyproject.toml|uv.lock
- dependency: django|fastapi
- file_exists: manage.py|app/|src/|main.py|asgi.py|wsgi.py

## Minimum Match

2/3

## Variants

| Framework | Tespit Dosyasi | Oncelik |
|-----------|----------------|---------|
| Django | `backend/python/django/detect.md` | 1 |
| FastAPI | `backend/python/fastapi/detect.md` | 2 |

## Activates

- rules/python-backend-rules.md

## Affects Core

- task-hunter: `pytest` veya proje test komutlari icin verification convention'i eklenir
- CLAUDE.md: Python backend ortak kurallari bolumu eklenir
