# Docker Modul Tespiti

## Checks

- file_exists: Dockerfile | */Dockerfile
- file_exists: docker-compose.yml | docker-compose.yaml | compose.yml
- file_exists: .dockerignore

## Minimum Match

2/3

## Activates

- commands/pre-deploy.md (slash command)
- commands/post-deploy.md (slash command)
- agents/devops.md (sub-agent)

## Affects Core

- workflow-lifecycle: Deploy akisi eklenir (pre-deploy → deploy → post-deploy)
- CLAUDE.md: Deploy kurallari bolumu eklenir
