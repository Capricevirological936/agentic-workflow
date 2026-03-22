---
id: TASK-33
title: >-
  P2: AGENTS.md dosyasi mimari karara aykiri — sadece Claude Code ekosistemi
  kullanilmali
status: Done
assignee:
  - '@claude'
created_date: '2026-03-22 19:23'
updated_date: '2026-03-22 19:33'
labels:
  - consistency
  - architecture
  - cleanup
dependencies: []
references:
  - AGENTS.md
  - CLAUDE.md
  - memory/project_architecture_decisions.md — 'Sadece Claude Code odak' karari
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem

Proje root dizininde `AGENTS.md` dosyasi mevcut. Ancak mimari karar bunu acikca yasakliyor:

> "Karar: Gemini, Codex, Copilot destegi kaldirildi."
> "How to apply: AGENTS.md ve GEMINI.md uretme. Sadece .claude/ ekosistemi."

Dosyanin icerigi sadece Backlog MCP yonergelerinden olusuyor (30 satir). Bu icerik zaten CLAUDE.md'de de mevcut.

## Etki

- Proje yapisi ile dokumante edilen mimari kararlar arasinda celiskiye yol aciyor
- Coklu-agent destegi oldugu izlenimini yaratabilir
- CLAUDE.md ile icerik tekrarina neden oluyor

## Cozum

1. AGENTS.md'deki Backlog MCP icerigi zaten CLAUDE.md'de varsa → dosyayi sil
2. Eger benzersiz icerik varsa → CLAUDE.md'ye tasi, sonra AGENTS.md'yi sil
3. .gitignore'a AGENTS.md ekle (gelecekte tekrar olusturulmasini engelle)

## Etkilenen Dosyalar
- `/AGENTS.md` (silinecek)
- `/CLAUDE.md` (gerekirse icerik tasima)
- `/.gitignore` (AGENTS.md eklenmeli)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AGENTS.md dosyasi root dizinden kaldirildi
- [x] #2 AGENTS.md deki benzersiz icerik (varsa) CLAUDE.md ye tasinmis
- [x] #3 Mimari karar ile dosya yapisi artik tutarli
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
AGENTS.md silindi. Icerik CLAUDE.md ile %100 ayni (Backlog MCP guidelines) — benzersiz icerik yok, tasima gerekmedi. .gitignore zaten AGENTS.md'yi haric tutuyor (satir 41) — gelecekte tekrar olusturulmasi engellendi.
<!-- SECTION:FINAL_SUMMARY:END -->
