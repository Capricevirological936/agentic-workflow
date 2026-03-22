# Flutter Modul Tespiti

## Checks

- file_exists: pubspec.yaml
- dependency: flutter
- file_pattern: lib/**/*.dart

## Minimum Match

2/3

## Activates

- rules/flutter-rules.skeleton.md

## Affects Core

- code-review: Flutter/Dart anti-pattern kontrolu eklenir (gereksiz rebuild, dynamic tip, print kullanimi vb.)
- task-hunter: IMPLEMENTATION_RULES'a Flutter widget ve state yonetim kurallari eklenir
- settings.json: Flutter/Dart plugin konfigurasyonu eklenir
