# GitHub Actions Modul Tespiti

## Checks

- file_exists: .github/workflows/ (directory)
- file_pattern: .github/workflows/*.yml | .github/workflows/*.yaml
- file_exists: .github/actions/ | .github/dependabot.yml

## Minimum Match

2/3

## Activates

- rules/github-actions-rules.skeleton.md

## Affects Core

- workflow-lifecycle: GitHub Actions workflow entegrasyonu
- CLAUDE.md: GA best practice kurallari
- pre-deploy: Workflow status kontrolu
