# Express Modul Tespit Kurallari

## Checks

- dependency: express
- code_pattern: express()|Router()
- file_exists: server.js|server.ts|app.js|app.ts|src/app.*

## Minimum Match

2/3

## Activates

- rules/express-rules.skeleton.md

## Affects Core

- task-hunter: `npm test` ve varsa `npm run lint` / `npm run typecheck` dogrulamalari beklenir
- CLAUDE.md: Express middleware, route ve hata yonetimi kurallari eklenir
