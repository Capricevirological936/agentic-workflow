# CodeIgniter 4 Modul Tespit Kurallari

## Checks

- dependency: codeigniter4/framework
- file_exists: spark
- file_exists: app/Config/|app/Controllers/|app/Filters/

## Minimum Match

2/3

## Activates

- hooks/spark-guard.js (PreToolUse Bash)
- rules/codeigniter4-rules.skeleton.md

## Affects Core

- task-hunter: VERIFICATION_COMMANDS'a `php spark test` veya proje test komutu eklenir
- workflow-lifecycle: Spark komut korumalari eklenir
- CLAUDE.md: CodeIgniter 4 kodlama kurallari bolumu eklenir
- settings.json: 1 hook tanimi eklenir
