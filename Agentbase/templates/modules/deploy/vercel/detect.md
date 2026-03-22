# Vercel Modul Tespiti

## Checks

- file_exists: vercel.json
- dependency: vercel
- file_exists: .vercel/

## Minimum Match

2/3

## Activates

- commands/pre-deploy.skeleton.md (slash command)

## Affects Core

- workflow-lifecycle: Vercel deploy akisi eklenir (pre-deploy → vercel deploy → post-deploy)
- CLAUDE.md: Vercel deploy kurallari bolumu eklenir
