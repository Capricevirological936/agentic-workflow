# NestJS Modul Tespit Kurallari

## Checks

- dependency: @nestjs/core|@nestjs/common
- file_exists: nest-cli.json|nest.json
- code_pattern: @Module()|@Controller()|@Injectable()

## Minimum Match

2/3

## Activates

- rules/nestjs-rules.md

## Affects Core

- task-hunter: `test`, `lint` ve varsa `test:e2e` convention'lari beklenir
- CLAUDE.md: NestJS module/provider/controller kurallari eklenir
