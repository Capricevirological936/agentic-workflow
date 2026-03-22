# Coolify Modul Tespiti

## Checks

- file_exists: docker-compose.prod.yml | docker-compose.yml
- file_exists: Dockerfile
- file_exists: entrypoint.sh

> Not: Coolify tespiti Docker tespiti ile cakisabilir. Bootstrap roportajinda "Deploy platformunuz nedir?" sorusu ile netlestirilir. Coolify secilirse Docker modulu YERINE Coolify modulu aktive edilir (cunku Coolify zaten Docker kullanir).

## Minimum Match

2/3

## Activates

- commands/pre-deploy.skeleton.md (Coolify-spesifik kontroller)
- commands/post-deploy.skeleton.md (Coolify API ile dogrulama)
- agents/devops.skeleton.md (Coolify + Docker + Traefik uzmani)

## Affects Core

- workflow-lifecycle: Coolify deploy akisi, rollback proseduru
- CLAUDE.md: Deploy kurallari
