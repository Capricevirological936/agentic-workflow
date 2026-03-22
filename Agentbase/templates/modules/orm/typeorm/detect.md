# TypeORM Modul Tespiti

## Checks

- dependency: typeorm
- file_exists: ormconfig.js | ormconfig.ts | ormconfig.json | data-source.ts
- file_exists: src/migrations/ | migrations/

## Minimum Match

2/3

## Activates

- hooks/typeorm-sync-guard.js (PreToolUse Bash)
- rules/typeorm-rules.md

## Affects Core

- task-hunter: VERIFICATION_COMMANDS'a `npx typeorm migration:show` eklenir
- workflow-lifecycle: Migration fail protokolu eklenir
- CLAUDE.md: TypeORM kurallari bolumu eklenir
- settings.json: 1 hook tanimi eklenir
