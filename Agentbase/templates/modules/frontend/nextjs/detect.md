# Next.js Modul Tespiti

## Checks

- dependency: next
- file_exists: next.config.js | next.config.mjs | next.config.ts
- file_exists: app/ | pages/

## Minimum Match

2/3

## Activates

- rules/nextjs-rules.md

## Affects Core

- code-review: Next.js anti-pattern kontrolu eklenir (client/server karisimi, img tagi vb.)
- task-hunter: IMPLEMENTATION_RULES'a Next.js rendering ve routing kurallari eklenir
- settings.json: Next.js plugin konfigurasyonu eklenir
