# OpenAPI/Swagger Modul Tespiti

## Checks

- file_exists: openapi.yaml | openapi.yml | openapi.json | swagger.yaml | swagger.yml | swagger.json
- dependency: @nestjs/swagger | swagger-ui-express | swagger-jsdoc | drf-spectacular | drf-yasg
- file_pattern: **/*.openapi.* | **/api-docs.*

## Minimum Match

2/3

## Activates

- hooks/openapi-sync-check.js (PostToolUse Edit|Write)
- rules/openapi-rules.md

## Affects Core

- code-review: Endpoint <-> spec uyumu kontrolu
- pre-deploy: openapi validate komutu
- CLAUDE.md: OpenAPI kurallari
- settings.json: 1 hook tanimi
