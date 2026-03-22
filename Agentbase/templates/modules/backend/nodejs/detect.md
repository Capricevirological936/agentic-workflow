# Node.js Backend Ailesi Tespit Kurallari

## Checks

- file_exists: package.json
- dependency: express|fastify|@nestjs/core
- file_exists: src/main.ts|src/app.ts|server.ts|server.js|app.js|api/

## Minimum Match

2/3

## Variants

| Framework | Tespit Dosyasi | Oncelik |
|-----------|----------------|---------|
| NestJS | `backend/nodejs/nestjs/detect.md` | 1 |
| Fastify | `backend/nodejs/fastify/detect.md` | 2 |
| Express | `backend/nodejs/express/detect.md` | 3 |

## Activates

- rules/nodejs-rules.md

## Affects Core

- task-hunter: `npm`/`pnpm`/`yarn` tabanli lint-test-typecheck convention'lari eklenir
- CLAUDE.md: Node.js backend ortak kurallari bolumu eklenir
