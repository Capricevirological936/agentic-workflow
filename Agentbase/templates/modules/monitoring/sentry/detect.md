# Sentry Modul Tespiti

## Checks

- dependency: @sentry/node | @sentry/react | @sentry/react-native | @sentry/browser | sentry-sdk
- file_pattern: sentry.*.ts | sentry.*.js | sentry.config.* | instrument.*
- env_var: SENTRY_DSN | NEXT_PUBLIC_SENTRY_DSN | EXPO_PUBLIC_SENTRY_DSN

## Minimum Match

2/3

## Activates

- rules/sentry-rules.md

## Affects Core

- code-review: Error boundary kontrolu, unhandled rejection tespiti
- pre-deploy: Source map upload kontrolu, release tagging
- CLAUDE.md: Sentry entegrasyon kurallari bolumu eklenir
